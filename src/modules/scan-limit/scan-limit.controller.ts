import { Response } from "express";

import { getGuestId } from "../../lib/cookies.js";
import { AuthenticatedRequest } from "../../middleware/auth.js";
import { ScanLimitService } from "./scan-limit.service.js";

export class ScanLimitController {
  static async checkLimit(req: AuthenticatedRequest, res: Response) {
    try {
      // Get userId from authenticated user or guestId from guest
      let userId = undefined;
      let guestId = undefined;

      if (req.user) {
        userId = req.user.id;
      } else {
        guestId = getGuestId(req);
      }

      if (!userId && !guestId) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Unable to identify user or guest",
        });
      }

      const limit = await ScanLimitService.checkLimit({ userId, guestId });

      // Transform data to match frontend interface
      const transformedData = {
        canScan: limit.remaining > 0,
        remaining: limit.remaining,
        resetAt: limit.resetAt.toISOString(),
        isGuest: !!guestId,
      };

      res.json({
        success: true,
        data: transformedData,
      });
    } catch (error) {
      console.error("Scan limit check error:", error);
      res.status(500).json({
        error: "Failed to check scan limit",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
