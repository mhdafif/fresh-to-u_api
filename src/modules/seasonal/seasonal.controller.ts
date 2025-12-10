import { Response } from "express";

import { type AuthenticatedRequest } from "../../middleware/auth.js";
import { SeasonalService } from "./seasonal.service.js";

export class SeasonalController {
  static async getSeasonalFoods(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        month,
        latitude,
        longitude,
        country,
        region,
        limit = 50,
        offset = 0,
      } = req.query;

      const params: any = {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      if (month) {
        params.month = parseInt(month as string);
      }

      if (latitude && longitude) {
        params.location = {
          latitude: parseFloat(latitude as string),
          longitude: parseFloat(longitude as string),
          country: country as string,
          region: region as string,
        };
      }

      const foods = await SeasonalService.getSeasonalFoods(params);

      res.json({
        data: foods,
        meta: {
          message: "Successfully retrieved seasonal foods",
          code: "success",
        },
      });
    } catch (error) {
      console.error("Get seasonal foods error:", error);
      res.status(500).json({
        message: "Failed to get seasonal foods",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getSeasonalByMonth(req: AuthenticatedRequest, res: Response) {
    try {
      const { month } = req.params;

      if (
        !month ||
        isNaN(parseInt(month)) ||
        parseInt(month) < 1 ||
        parseInt(month) > 12
      ) {
        return res.status(400).json({
          message: "Invalid month parameter. Must be between 1 and 12.",
          status: "error",
          code: "400",
        });
      }

      const monthNumber = parseInt(month);
      const seasonalData =
        await SeasonalService.getSeasonalByMonth(monthNumber);

      res.json({
        data: seasonalData,
        meta: {
          message: "Successfully retrieved seasonal foods for month",
          code: "success",
        },
      });
    } catch (error) {
      console.error("Get seasonal by month error:", error);
      res.status(500).json({
        message: "Failed to get seasonal foods by month",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getLocationBasedSeasonal(
    req: AuthenticatedRequest,
    res: Response
  ) {
    try {
      const {
        latitude,
        longitude,
        country,
        region,
        limit = 12,
        offset = 0,
      } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          message:
            "Latitude and longitude are required for location-based seasonal data",
          status: "error",
          code: "400",
        });
      }

      const params = {
        latitude: parseFloat(latitude as string),
        longitude: parseFloat(longitude as string),
        country: country as string,
        region: region as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const locationBasedData =
        await SeasonalService.getLocationBasedSeasonal(params);

      res.json({
        data: locationBasedData,
        meta: {
          message: "Successfully retrieved location-based seasonal foods",
          code: "success",
          location: {
            latitude: params.latitude,
            longitude: params.longitude,
            country: params.country,
            region: params.region,
          },
        },
      });
    } catch (error) {
      console.error("Get location-based seasonal error:", error);
      res.status(500).json({
        message: "Failed to get location-based seasonal foods",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getFoodDetail(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "Food ID is required",
          status: "error",
          code: "400",
        });
      }

      const foodDetail = await SeasonalService.getFoodDetail(id);

      if (!foodDetail) {
        return res.status(404).json({
          message: "Food not found",
          status: "error",
          code: "404",
        });
      }

      res.json({
        data: foodDetail,
        meta: {
          message: "Successfully retrieved food details",
          code: "success",
        },
      });
    } catch (error) {
      console.error("Get food detail error:", error);
      res.status(500).json({
        message: "Failed to get food details",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
}
