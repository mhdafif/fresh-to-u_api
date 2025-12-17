import { Response } from "express";
import { z } from "zod";

import { FoodService } from "./food.service.js";

const searchFoodSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
});

export class FoodController {
  static async getAll(req: any, res: Response) {
    try {
      const validatedData = searchFoodSchema.parse(req.query);
      const result = await FoodService.getAll({
        page: validatedData.page,
        per_page: validatedData.per_page,
        search: validatedData.search,
      });

      res.json({
        success: true,
        data: result.foods,
        meta: {
          total: result.total,
          page: result.page,
          per_page: result.per_page,
          total_pages: Math.ceil(result.total / result.per_page),
        },
      });
    } catch (error) {
      console.error("Get foods error:", error);
      res.status(500).json({
        error: "Failed to get foods",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getById(req: any, res: Response) {
    try {
      const { id } = req.params;
      const food = await FoodService.findById(id);

      if (!food) {
        return res.status(404).json({
          error: "Food not found",
          message: `Food with id ${id} not found`,
        });
      }

      res.json({
        success: true,
        data: food,
      });
    } catch (error) {
      console.error("Get food error:", error);
      res.status(500).json({
        error: "Failed to get food",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
