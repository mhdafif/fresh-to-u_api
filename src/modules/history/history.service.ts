// import { prisma } from "../../prisma/client";
import { prisma } from "../../prisma";

import {
  CreateHistoryData,
  GetHistoryOptions,
  GuestScanLimitInfo,
  HistoryOwner,
} from "./interfaces";

export class HistoryService {
  static async create(data: CreateHistoryData) {
    // If guestId is provided, ensure the guest exists
    if (data.guestId) {
      await prisma.guest.upsert({
        where: { sessionId: data.guestId },
        update: {},
        create: { sessionId: data.guestId },
      });
    }

    return prisma.history.create({
      data: {
        ...data,
        // detail: data.detail || null,
        detail: data.detail
          ? JSON.parse(JSON.stringify(data.detail))
          : undefined,
      },
      // include: {
      //   user: {
      //     select: {
      //       id: true,
      //       email: true,
      //     },
      //   },
      // },
    });
  }

  static async getHistory(
    owner: HistoryOwner,
    options: GetHistoryOptions = { page: 1, per_page: 20 }
  ) {
    const { page, per_page, type, search } = options;
    const { userId, guestId } = owner;

    // Calculate skip and take
    const skip = (page - 1) * per_page;

    // For guest users, limit to last 5 items total
    // const actualLimit = userId ? per_page : Math.min(per_page, 5);
    // const actualSkip = userId ? skip : Math.min(skip, 5); // Guests can't skip beyond 5 items

    // Build where clause
    const whereClause: any = {
      OR: [{ userId: userId || undefined }, { guestId: guestId || undefined }],
    };

    // Add type filter if specified
    if (type) {
      whereClause.type = type;
    }

    // Add search filter if specified (search by food name in resultLabel)
    if (search && search.trim()) {
      whereClause.AND = [
        ...(whereClause.AND || []),
        {
          resultLabel: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    const [histories, total] = await Promise.all([
      prisma.history.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
        take: per_page,
        skip: skip,
        // include: {
        //   user: {
        //     select: {
        //       id: true,
        //       email: true,
        //     },
        //   },
        // },
      }),
      prisma.history.count({
        where: whereClause,
      }),
    ]);
    // Return histories as-is (meta field is already parsed by Prisma)
    const parsedHistories = histories.map((history) => ({
      ...history,
      detail: history.detail || null,
    }));

    return {
      histories: parsedHistories,
      total,
    };
  }

  static async deleteHistory(id: string, owner: HistoryOwner) {
    const { userId, guestId } = owner;

    // First check if the history belongs to the user/guest
    const history = await prisma.history.findFirst({
      where: {
        id,
        OR: [
          { userId: userId || undefined },
          { guestId: guestId || undefined },
        ],
      },
    });

    if (!history) {
      throw new Error("History not found or access denied");
    }

    return prisma.history.delete({
      where: { id },
    });
  }

  static async clearHistory(owner: HistoryOwner) {
    const { userId, guestId } = owner;

    return prisma.history.deleteMany({
      where: {
        OR: [
          { userId: userId || undefined },
          { guestId: guestId || undefined },
        ],
      },
    });
  }

  static async getHistoryCount(owner: HistoryOwner): Promise<number> {
    const { userId, guestId } = owner;

    return prisma.history.count({
      where: {
        OR: [
          { userId: userId || undefined },
          { guestId: guestId || undefined },
        ],
      },
    });
  }

  static async getTodayScanCount(guestId: string | null): Promise<number> {
    // If no guestId, return 0
    if (!guestId) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    return prisma.history.count({
      where: {
        guestId,
        type: "SCAN",
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  static async getTodayScanCountForUser(
    userId: string | null
  ): Promise<number> {
    // If no userId, return 0
    if (!userId) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    return prisma.history.count({
      where: {
        userId,
        type: "SCAN",
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  static async canGuestScan(
    guestId: string | null,
    dailyLimit: number = 10
  ): Promise<GuestScanLimitInfo> {
    // If no guestId, user cannot scan
    if (!guestId) {
      return {
        canScan: false,
        remainingScans: 0,
        resetTime: null,
      };
    }

    const todayScanCount = await this.getTodayScanCount(guestId);
    const remainingScans = Math.max(0, dailyLimit - todayScanCount);

    // Calculate reset time (start of next day)
    const resetTime = new Date();
    resetTime.setHours(0, 0, 0, 0); // Start of today
    resetTime.setDate(resetTime.getDate() + 1); // Tomorrow

    return {
      canScan: remainingScans > 0,
      remainingScans,
      resetTime,
    };
  }
}
