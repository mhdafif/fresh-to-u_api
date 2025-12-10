import { type Router as ExpressRouter, Router } from "express";

import { optionalAuth } from "../../middleware/auth";
import { SeasonalController } from "./seasonal.controller";

const router: ExpressRouter = Router();

// Get all seasonal foods with optional filtering
router.get("/", optionalAuth, SeasonalController.getSeasonalFoods);

// Get seasonal foods by specific month
router.get(
  "/month/:month",
  optionalAuth,
  SeasonalController.getSeasonalByMonth
);

// Get location-based seasonal foods
router.get(
  "/location",
  optionalAuth,
  SeasonalController.getLocationBasedSeasonal
);

// Get detailed information about a specific food
router.get("/food/:id", optionalAuth, SeasonalController.getFoodDetail);

export default router;
