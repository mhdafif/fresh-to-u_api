import { Response } from "express";

import { getGuestId } from "../../lib/cookies.js";
import { type AuthenticatedRequest } from "../../middleware/auth.js";
import { HistoryService } from "./history.service.js";

export class HistoryController {
  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const per_page = parseInt(req.query.per_page as string) || 10;
      const type = req.query.type as "SCAN" | "SEARCH";
      const search = req.query.search as string;

      let userId = null;
      let guestId = null;

      if (req.user) {
        userId = req.user.id;
      } else {
        // For guest users, use session ID
        guestId = getGuestId(req);
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

  // static async checkScanLimit(req: AuthenticatedRequest, res: Response) {
  //   try {
  //     if (req.user) {
  //       // Authenticated users have no scan limits
  //       return res.json({
  //         data: {
  //           canScan: true,
  //           remainingScans: -1, // Unlimited
  //           resetTime: null,
  //           isGuest: false,
  //         },
  //         meta: {
  //           message: "Successfully checked scan limit",
  //           code: "success",
  //         },
  //       });
  //     } else {
  //       // For guest users, check daily scan limit
  //       const guestId = getGuestId(req);
  //       const limitInfo = await HistoryService.canGuestScan(guestId);

  //       return res.json({
  //         data: {
  //           ...limitInfo,
  //           isGuest: true,
  //         },
  //         meta: {
  //           message: "Successfully checked scan limit",
  //           code: "success",
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Check scan limit error:", error);
  //     res.status(500).json({
  //       message: "Failed to check scan limit",
  //       status: "error",
  //       code: "500",
  //       data: {
  //         details: error instanceof Error ? error.message : "Unknown error",
  //       },
  //     });
  //   }
  // }
}
