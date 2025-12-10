import { Router } from "express";

import { optionalAuth } from "../../middleware/auth.js";
import { HistoryController } from "./history.controller.js";

const router: Router = Router();

// All history routes support authentication or guest access
router.use(optionalAuth);

// Check scan limit
router.get("/scan-limit", HistoryController.checkScanLimit);

// Get user stats
router.get("/stats", HistoryController.getStats);

// Save history item
router.post("/", HistoryController.save);

// Get history items
router.get("/", HistoryController.getHistory);

// Delete specific history item
router.delete("/:id", HistoryController.deleteHistory);

// Clear all history for user/guest
router.delete("/", HistoryController.clearHistory);

export default router;
