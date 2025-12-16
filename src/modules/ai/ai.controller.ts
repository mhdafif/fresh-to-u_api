import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { Response } from "express";
import { z } from "zod";

import { getGuestId } from "../../lib/cookies.js";
import { R2StorageService } from "../../lib/storage/r2.js";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { HistoryService } from "../history/history.service.js";
import { FoodService } from "../food/food.service.js";
import { AIIdentifyRequest, AIIdentifyResponse } from "./interfaces.js";
import { promptEn } from "./prompt.js";
import { ScanLimitService } from "../scan-limit/scan-limit.service.js";

const identifySchema = z.object({
  image: z.string().min(1, "Image is required"),
  locale: z.enum(["id", "en"]).default("en"),
  type: z.enum(["SCAN", "SEARCH"]).optional(),
});

export class AIController {
  static async identify(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = identifySchema.parse(req.body) as AIIdentifyRequest;

      // Get userId from authenticated user or guestId from guest
      let userId = undefined;
      let guestId = undefined;

      if (req.user) {
        userId = req.user.id;
      } else {
        guestId = getGuestId(req);
      }

      // Check scan limits
      const limit = await ScanLimitService.checkLimit({ userId, guestId });

      if (limit.remaining <= 0) {
        return res.status(429).json({
          error: "Limit Exceeded",
          message:
            "You have reached your scan limit. Please upgrade try again later.",
          // "You have reached your scan limit. Please upgrade your plan or try again later.",
          data: {
            remaining: limit.remaining,
            // total: limit.total,
            isLimitExceeded: limit.remaining <= 0,
          },
        });
      }

      // Upload image to R2 storage
      let imageUrl: string | null = null;
      try {
        const uploadResult = await R2StorageService.uploadBase64Image(
          validatedData.image
        );
        imageUrl = uploadResult.url;
      } catch (uploadError) {
        console.error("Failed to upload image to R2:", uploadError);
        // Continue with AI processing even if upload fails
      }

      const systemPrompt = `${promptEn}
      - Respond in locale ${validatedData.locale}.`;

      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Identify the food in this image and return the result in valid JSON format. responde in locale ${validatedData.locale}.`,
              },
              {
                type: "image",
                image: validatedData.image,
              },
            ],
          },
        ],
        temperature: 0.1,
        maxRetries: 2,
      });

      // Clean up the AI response - remove any markdown formatting or extra text
      let cleanedText = text.trim();

      // Remove markdown code blocks if present
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");

      // Try to extract JSON from the text if there's extra content
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : cleanedText;

      try {
        const result = JSON.parse(jsonText) as AIIdentifyResponse;

        // Add locale and image URL to response
        result.locale = validatedData.locale || "id";

        // Add image information to response if available
        if (imageUrl) {
          result.imageUrl = imageUrl;
        }

        // Validate the result structure for food items
        if (
          !result.name ||
          !result.category ||
          typeof result.confidence !== "number"
        ) {
          throw new Error("Invalid response structure");
        }

        if (result.category !== "OTHER") {
          // Handle food tracking using FoodService
          try {
            await FoodService.findOrCreateFood({
              name: result.name,
              variety: result.notes.variety_guess || null,
              detail: JSON.parse(JSON.stringify(result)),
            });
          } catch (foodError) {
            console.error("Failed to track food:", foodError);
            // Continue with the response even if food tracking fails
          }
        }

        let userId = null;
        let guestId = null;
        const type = req.body.type || "SCAN";

        if (req.user) {
          userId = req.user.id;
        } else {
          guestId = getGuestId(req);
        }

        // Update scan limits after successful scan
        try {
          await ScanLimitService.decrementLimit({ userId, guestId });
        } catch (limitError) {
          console.error("Failed to decrement limit:", limitError);
          // Continue with response even if limit update fails
        }

        await HistoryService.create({
          userId,
          guestId,
          type,
          query: "",
          resultLabel: result.name,
          confidence: result.confidence,
          detail: JSON.parse(JSON.stringify(result)),
        });

        res.json(result);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        console.error("Raw AI response:", text);
        console.error("Cleaned response:", jsonText);

        // Try to fix common JSON issues
        let fixedJson = jsonText;

        // Fix trailing commas
        fixedJson = fixedJson.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

        // Fix missing quotes around property names
        fixedJson = fixedJson.replace(/(\w+):/g, '"$1":');

        try {
          const result = JSON.parse(fixedJson) as AIIdentifyResponse;

          // Add locale and image URL to response
          result.locale = validatedData.locale || "id";

          // Add image information to response if available
          if (imageUrl) {
            result.imageUrl = imageUrl;
          }

          if (result.category !== "OTHER") {
            // Handle food tracking using FoodService
            try {
              await FoodService.findOrCreateFood({
                name: result.name,
                variety: result.notes.variety_guess || null,
                detail: JSON.parse(JSON.stringify(result)),
              });
            } catch (foodError) {
              console.error("Failed to track food:", foodError);
              // Continue with the response even if food tracking fails
            }
          }

          let userId = null;
          let guestId = null;
          const type = req.body.type || "SCAN";

          if (req.user) {
            userId = req.user.id;
          } else {
            guestId = getGuestId(req);
          }

          // Update scan limits after successful scan
          try {
            await ScanLimitService.decrementLimit({ userId, guestId });
          } catch (limitError) {
            console.error("Failed to decrement limit:", limitError);
            // Continue with response even if limit update fails
          }

          await HistoryService.create({
            userId,
            guestId,
            type,
            query: "",
            resultLabel: result.name,
            confidence: result.confidence,
            detail: JSON.parse(JSON.stringify(result)),
          });

          res.json(result);
        } catch (secondParseError) {
          res.status(500).json({
            error: "Failed to parse AI response",
            message:
              parseError instanceof Error
                ? parseError.message
                : "Unknown parsing error",
            rawResponse: text,
            cleanedResponse: jsonText,
          });
        }
      }
    } catch (error) {
      console.error("AI identification error:", error);
      res.status(500).json({
        error: "Failed to identify food",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
