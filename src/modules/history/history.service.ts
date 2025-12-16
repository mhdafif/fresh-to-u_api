import { prisma } from "../../prisma.js";

import {
  CreateHistoryData,
  GetHistoryOptions,
  HistoryOwner,
} from "./interfaces.js";

export class HistoryService {
  static async create(data: CreateHistoryData) {
    // If guestId is provided, ensure the guest exists
    if (data.guestId) {
      await prisma.guest.upsert({
        where: { id: data.guestId },
        update: {},
        create: { id: data.guestId },
      });
    }

    return prisma.history.create({
      data: {
        ...data,
        detail: data.detail
          ? JSON.parse(JSON.stringify(data.detail))
          : undefined,
      },
    });
  }

  static async getHistory(
    owner: HistoryOwner,
    options: GetHistoryOptions = { page: 1, per_page: 20 }
  ) {
    const { userId, guestId } = owner;
    const { page, per_page, type, search } = options;

    // Calculate skip and take
    const skip = (page - 1) * per_page;

    // For guest users, limit to last 5 items total
    // const actualLimit = userId ? per_page : Math.min(per_page, 5);
    // const actualSkip = userId ? skip : Math.min(skip, 5); // Guests can't skip beyond 5 items

    // Build where clause
    // const whereClause: any = {
    //   OR: [{ userId: userId || undefined }, { guestId: guestId || undefined }],
    // };

    // // Add type filter if specified
    // if (type) {
    //   whereClause.type = type;
    // }

    // // Add search filter if specified (search by food name in resultLabel)
    // if (search && search.trim()) {
    //   whereClause.AND = [
    //     ...(whereClause.AND || []),
    //     {
    //       resultLabel: {
    //         contains: search.trim(),
    //         mode: "insensitive",
    //       },
    //     },
    //   ];
    // }

    const [histories, total] = await Promise.all([
      prisma.history.findMany({
        // where: whereClause,
        where: {
          type,
          OR: [
            { userId: userId || undefined },
            { guestId: guestId || undefined },
          ],
          AND: [
            {
              resultLabel: {
                contains: search?.trim() || "",
                mode: "insensitive",
              },
            },
          ],
        },
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
        // where: whereClause,
        where: {
          type,
          OR: [
            { userId: userId || undefined },
            { guestId: guestId || undefined },
          ],
          AND: [
            {
              resultLabel: {
                contains: search?.trim() || "",
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    ]);
    // console.log("histories", histories);
    // Return histories as-is (meta field is already parsed by Prisma)
    // const parsedHistories = histories.map((history) => ({
    //   ...history,
    //   detail: history.detail || null,
    // }));

    return {
      // histories: parsedHistories,
      histories,
      total,
    };
  }
}
