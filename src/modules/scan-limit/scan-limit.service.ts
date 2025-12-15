import { prisma } from "../../prisma.js";
import {
  ScanLimitCheckRequest,
  ScanLimitCreateRequest,
  ScanLimitUpdateRequest,
} from "./scan-limit.interfaces.js";

export class ScanLimitService {
  static async checkLimit(request: ScanLimitCheckRequest) {
    const { userId, guestId } = request;

    if (!userId && !guestId) {
      throw new Error("Either userId or guestId must be provided");
    }

    // Try to find existing limit
    let limit = await prisma.scanLimit.findFirst({
      where: {
        OR: [{ userId }, { guestId }],
      },
    });

    if (!limit) {
      // If no limit exists, create one with default values
      const defaultTotal = 10;
      try {
        limit = await this.createLimit({
          userId,
          guestId,
          total: defaultTotal,
        });
      } catch (error) {
        console.error("Error creating limit:", error);
        // Fallback: try to find the limit again (might have been created by another request)
        limit = await prisma.scanLimit.findFirst({
          where: {
            OR: [{ userId }, { guestId }],
          },
        });

        if (!limit) {
          throw new Error("Failed to create limit after constraint violation");
        }
      }
    }

    // Check if limit needs to be reset
    const now = new Date();
    if (now >= limit.resetAt) {
      // Reset the limit to full capacity and set new reset time
      limit = await this.resetLimit({
        userId,
        guestId,
      });
    }

    return {
      remaining: limit.remaining,
      total: limit.total,
      isLimitExceeded: limit.remaining <= 0,
      resetAt: limit.resetAt,
    };
  }

  static async createLimit(request: ScanLimitCreateRequest) {
    const { userId, guestId, total } = request;

    if (!userId && !guestId) {
      throw new Error("Either userId or guestId must be provided");
    }

    // Calculate reset time with validation
    let resetAt = this.calculateNextDayResetTime();

    // Validate the resetAt date and provide a safe fallback
    if (!resetAt || isNaN(resetAt.getTime())) {
      console.error("Invalid resetAt date calculated, using fallback");
      // Fallback: 24 hours from now in a clean date object
      const now = new Date();
      resetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    console.log("Creating limit with resetAt:", resetAt.toISOString());
    console.log("resetAt type:", typeof resetAt);
    console.log("resetAt value:", resetAt);

    try {
      return await prisma.scanLimit.create({
        data: {
          userId: userId || null,
          guestId: guestId || null,
          remaining: total,
          total,
          resetAt: resetAt, // Ensure it's a Date object
        },
      });
    } catch (error: any) {
      // If there's a unique constraint violation, the limit already exists
      if (error.code === "P2002") {
        console.log("Limit already exists, returning existing limit");
        // Return the existing limit
        const existingLimit = await prisma.scanLimit.findFirst({
          where: {
            OR: [{ userId }, { guestId }],
          },
        });

        if (!existingLimit) {
          throw new Error("Failed to create or retrieve limit");
        }

        return existingLimit;
      }

      // Re-throw other errors
      throw error;
    }
  }

  static async updateLimit(request: ScanLimitUpdateRequest) {
    const { userId, guestId, remaining } = request;

    if (!userId && !guestId) {
      throw new Error("Either userId or guestId must be provided");
    }

    return await prisma.scanLimit.updateMany({
      where: {
        OR: [{ userId }, { guestId }],
      },
      data: {
        remaining,
      },
    });
  }

  static async decrementLimit(request: ScanLimitCheckRequest) {
    const { userId, guestId } = request;

    if (!userId && !guestId) {
      throw new Error("Either userId or guestId must be provided");
    }

    const currentLimit = await prisma.scanLimit.findFirst({
      where: {
        OR: [{ userId }, { guestId }],
      },
    });

    if (!currentLimit) {
      throw new Error("No limit found for this user or guest");
    }

    if (currentLimit.remaining <= 0) {
      throw new Error("Limit already exceeded");
    }

    return await prisma.scanLimit.update({
      where: { id: currentLimit.id },
      data: {
        remaining: currentLimit.remaining - 1,
      },
    });
  }

  static async resetLimit(request: ScanLimitCheckRequest) {
    const { userId, guestId } = request;

    if (!userId && !guestId) {
      throw new Error("Either userId or guestId must be provided");
    }

    const currentLimit = await prisma.scanLimit.findFirst({
      where: {
        OR: [{ userId }, { guestId }],
      },
    });

    if (!currentLimit) {
      throw new Error("No limit found for this user or guest");
    }

    // Calculate reset time for next day at 00:00 UTC
    const resetAt = this.calculateNextDayResetTime();

    // Validate the resetAt date
    if (isNaN(resetAt.getTime())) {
      console.error("Invalid resetAt date in resetLimit, using fallback");
      resetAt.setTime(Date.now() + 24 * 60 * 60 * 1000); // Fallback: 24 hours from now
    }

    console.log("Resetting limit with new resetAt:", resetAt.toISOString());

    return await prisma.scanLimit.update({
      where: { id: currentLimit.id },
      data: {
        remaining: currentLimit.total, // Reset to full capacity
        resetAt,
      },
    });
  }

  static async getOrCreateDefaultLimit(
    request: ScanLimitCheckRequest,
    defaultTotal: number = 10
  ) {
    const { userId, guestId } = request;

    if (!userId && !guestId) {
      throw new Error("Either userId or guestId must be provided");
    }

    try {
      // Try to get existing limit
      const limit = await this.checkLimit(request);
      return limit;
    } catch (error) {
      // If no limit exists, create one with default values
      return await this.createLimit({
        userId,
        guestId,
        total: defaultTotal,
      });
    }
  }

  /**
   * Calculate the reset time for next day at 00:00 UTC
   */
  static calculateNextDayResetTime(): Date {
    const now = new Date();

    console.log("Current time (UTC):", now.toUTCString());

    // Get tomorrow's date at 00:00 UTC
    const tomorrow = new Date(now.getTime());
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    console.log("Calculated reset time (UTC):", tomorrow.toUTCString());

    // Validate the date
    if (isNaN(tomorrow.getTime())) {
      console.error("Failed to calculate reset time, using fallback");
      // Fallback: 24 hours from now
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    return tomorrow;
  }
}
