import { Router } from "express";

import { optionalAuth } from "../../middleware/auth.js";
import { HistoryController } from "./history.controller.js";

const router: Router = Router();

// All history routes support authentication or guest access
router.use(optionalAuth);

// Get history items
router.get("/", HistoryController.getHistory);

// Check scan limit
// router.get("/scan-limit", HistoryController.checkScanLimit);

export default router;
