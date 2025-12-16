import { Response } from "express";

import { AuthenticatedRequest } from "../../middleware/auth.js";
import { GuestService } from "./guest.service.js";
import { getClientIpAddress, getGuestId } from "../../lib/cookies.js";

export class GuestController {
  static async getOrCreateGuest(req: AuthenticatedRequest, res: Response) {
    try {
      // If user is authenticated, they don't need a guest session
      if (req.user) {
        return res.json({
          success: true,
          data: {
            isAuthenticated: true,
            userId: req.user.id,
            guestId: null,
          },
        });
      }

      // Get IP address from request
      const ipAddress = getClientIpAddress(req);
      // Get existing guestId from cookie or create new one
      const existingGuestId = getGuestId(req);

      const guest = await GuestService.getOrCreateGuest(
        existingGuestId,
        ipAddress
      );

      // Set guest cookie if it's a new guest
      if (!existingGuestId || existingGuestId !== guest.id) {
        GuestService.setGuestCookie(res, guest.id);
      }

      res.json({
        success: true,
        data: {
          // isAuthenticated: false,
          guestId: guest.id,
          // ipAddress: guest.ipAddress,
          // createdAt: guest.createdAt,
        },
      });
    } catch (error) {
      console.error("Guest creation error:", error);
      res.status(500).json({
        error: "Failed to create or get guest",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
