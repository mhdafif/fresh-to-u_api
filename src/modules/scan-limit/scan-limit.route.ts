import { Router } from "express";

import { optionalAuth } from "../../middleware/auth.js";
import { ScanLimitController } from "./scan-limit.controller.js";

const router: Router = Router();

// Apply optional auth to all scan-limit routes
router.use(optionalAuth);

router.get("/", ScanLimitController.checkLimit);
router.get("/default", ScanLimitController.getDefaultLimit);

export default router;
