import { Response } from "express";
import { prisma } from "../../prisma.js";

export class GuestService {
  static async createGuest(ipAddress?: string) {
    return await prisma.guest.create({
      data: {
        id: `guest-${crypto.randomUUID()}`,
        ipAddress,
      },
    });
  }

  // static async getGuestById(guestId: string) {
  //   return await prisma.guest.findUnique({
  //     where: { id: guestId },
  //     include: {
  //       histories: true,
  //     },
  //   });
  // }

  static async getOrCreateGuest(guestId?: string, ipAddress?: string) {
    if (guestId) {
      // Try to find existing guest
      const existingGuest = await prisma.guest.findUnique({
        where: { id: guestId },
      });

      if (existingGuest) {
        // Update IP address if provided and different
        if (ipAddress && existingGuest.ipAddress !== ipAddress) {
          return await prisma.guest.update({
            where: { id: guestId },
            data: { ipAddress },
          });
        }
        return existingGuest;
      }
    }

    // Create new guest if not found or no guestId provided
    return await this.createGuest(ipAddress);
  }

  static setGuestCookie(res: Response, guestId: string) {
    const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year
    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });
  }
}
