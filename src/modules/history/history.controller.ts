import { Response } from "express";

import { getSessionId } from "../../lib/cookies.js";
import { type AuthenticatedRequest } from "../../middleware/auth.js";
import { HistoryService } from "./history.service.js";

export class HistoryController {
  static async checkScanLimit(req: AuthenticatedRequest, res: Response) {
    try {
      if (req.user) {
        // Authenticated users have no scan limits
        return res.json({
          data: {
            canScan: true,
            remainingScans: -1, // Unlimited
            resetTime: null,
            isGuest: false,
          },
          meta: {
            message: "Successfully checked scan limit",
            code: "success",
          },
        });
      } else {
        // For guest users, check daily scan limit
        const guestId = getSessionId(req);
        const limitInfo = await HistoryService.canGuestScan(guestId);

        return res.json({
          data: {
            ...limitInfo,
            isGuest: true,
          },
          meta: {
            message: "Successfully checked scan limit",
            code: "success",
          },
        });
      }
    } catch (error) {
      console.error("Check scan limit error:", error);
      res.status(500).json({
        message: "Failed to check scan limit",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async save(req: AuthenticatedRequest, res: Response) {
    try {
      const { type, query, resultLabel, confidence, detail } = req.body;

      if (!type || !["SCAN", "SEARCH"].includes(type)) {
        return res.status(400).json({
          message: "Invalid or missing type",
          status: "error",
          code: "400",
        });
      }

      let userId = null;
      let guestId = null;

      if (req.user) {
        userId = req.user.id;
      } else {
        guestId = getSessionId(req);
      }

      const history = await HistoryService.create({
        userId,
        guestId,
        type,
        query,
        resultLabel,
        confidence,
        detail,
      });

      res.status(201).json({
        data: history,
        meta: {
          message: "History created successfully",
          code: "created",
        },
      });
    } catch (error) {
      console.error("Save history error:", error);
      res.status(500).json({
        message: "Failed to save history",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const per_page = parseInt(req.query.per_page as string) || 20;
      const type = req.query.type as "SCAN" | "SEARCH";
      const search = req.query.search as string;

      let userId = null;
      let guestId = null;

      if (req.user) {
        userId = req.user.id;
      } else {
        // For guest users, use session ID
        guestId = getSessionId(req);
      }
      const result = await HistoryService.getHistory(
        { userId, guestId },
        { page, per_page, type, search }
      );

      res.json({
        data: result.histories,
        meta: {
          current_page: page,
          last_page: Math.ceil(result.total / per_page),
          per_page,
          total: result.total,
        },
      });
    } catch (error) {
      console.error("Get history error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorDetails =
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error;

      res.status(500).json({
        message: "Failed to get history",
        status: "error",
        code: "500",
        data: {
          details: errorMessage,
          error: errorDetails,
        },
      });
    }
  }

  static async deleteHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          message: "History ID is required",
          status: "error",
          code: "400",
        });
      }

      let userId = null;
      let guestId = null;

      if (req.user) {
        userId = req.user.id;
      } else {
        // For guest users, use season ID
        guestId = getSessionId(req);
      }

      await HistoryService.deleteHistory(id, { userId, guestId });

      res.json({
        data: null,
        meta: {
          message: "History deleted successfully",
          code: "deleted",
        },
      });
    } catch (error) {
      console.error("Delete history error:", error);
      res.status(500).json({
        message: "Failed to delete history",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async clearHistory(req: AuthenticatedRequest, res: Response) {
    try {
      let userId = null;
      let guestId = null;

      if (req.user) {
        userId = req.user.id;
      } else {
        // For guest users, use season ID
        guestId = getSessionId(req);
      }

      await HistoryService.clearHistory({ userId, guestId });

      res.json({
        data: null,
        meta: {
          message: "History cleared successfully",
          code: "cleared",
        },
      });
    } catch (error) {
      console.error("Clear history error:", error);
      res.status(500).json({
        message: "Failed to clear history",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      let userId = null;
      let guestId = null;

      if (req.user) {
        userId = req.user.id;
      } else {
        // For guest users, use season ID
        guestId = getSessionId(req);
      }

      const [totalScans, todayScans] = await Promise.all([
        HistoryService.getHistoryCount({ userId, guestId }),
        userId
          ? HistoryService.getTodayScanCountForUser(userId)
          : HistoryService.getTodayScanCount(guestId),
      ]);

      res.json({
        data: {
          totalScans,
          todayScans,
        },
        meta: {
          message: "Successfully retrieved user stats",
          code: "success",
        },
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({
        message: "Failed to get user stats",
        status: "error",
        code: "500",
        data: {
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
}
