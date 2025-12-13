import { prisma } from "../../prisma.js";

export interface FoodCreateData {
  name: string;
  variety?: string | null;
  detail?: any;
}

export interface FoodUpdateData {
  variety?: string | null;
  detail?: any;
  timesSearched?: number;
}

export class FoodService {
  static async findByNameAndVariety(name: string, variety?: string | null) {
    return prisma.food.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        variety: variety || null,
      },
    });
  }

  static async create(data: FoodCreateData) {
    return prisma.food.create({
      data: {
        name: data.name,
        variety: data.variety || null,
        detail: data.detail ? JSON.parse(JSON.stringify(data.detail)) : null,
        timesSearched: 1,
      },
    });
  }

  static async update(id: string, data: FoodUpdateData) {
    return prisma.food.update({
      where: { id },
      data: {
        variety: data.variety !== undefined ? data.variety : undefined,
        detail:
          data.detail !== undefined
            ? data.detail
              ? JSON.parse(JSON.stringify(data.detail))
              : null
            : undefined,
        timesSearched:
          data.timesSearched !== undefined ? data.timesSearched : undefined,
      },
    });
  }

  static async incrementTimesSearched(id: string) {
    return prisma.food.update({
      where: { id },
      data: {
        timesSearched: {
          increment: 1,
        },
      },
    });
  }

  static async findOrCreateFood({
    name,
    variety,
    detail,
  }: {
    name: string;
    variety?: string | null;
    detail?: any;
  }) {
    // First try to find exact match (name + variety)
    let food = await this.findByNameAndVariety(name, variety);
    console.log("food uiii", food);
    if (food) {
      // Update existing food - increment times searched
      return await this.incrementTimesSearched(food.id);
    }

    // If not found with variety, try to find by name only (regardless of variety)
    food = await prisma.food.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (food) {
      // Food exists but with different variety - create new food record
      return await this.create({ name, variety, detail });
    }

    // Food doesn't exist at all - create new food record
    return await this.create({ name, variety, detail });
  }

  static async findById(id: string) {
    return prisma.food.findUnique({
      where: { id },
    });
  }

  static async getAll(
    options: { page?: number; per_page?: number; search?: string } = {}
  ) {
    const { page = 1, per_page = 20, search } = options;
    const skip = (page - 1) * per_page;

    const whereClause: any = {};

    if (search && search.trim()) {
      whereClause.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          variety: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    const [foods, total] = await Promise.all([
      prisma.food.findMany({
        where: whereClause,
        orderBy: {
          timesSearched: "desc",
        },
        take: per_page,
        skip,
      }),
      prisma.food.count({
        where: whereClause,
      }),
    ]);

    return {
      foods,
      total,
      page,
      per_page,
    };
  }
}
