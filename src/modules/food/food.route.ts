import { Router } from "express";

import { optionalAuth } from "../../middleware/auth.js";
import { FoodController } from "./food.controller.js";

const router: Router = Router();

// Apply optional auth middleware
router.use(optionalAuth);

router.get("/", FoodController.getAll);
router.get("/:id", FoodController.getById);

export default router;