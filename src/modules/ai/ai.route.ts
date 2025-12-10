import { Router } from "express";

import { optionalAuth } from "../../middleware/auth";
import { rateLimiter } from "../../middleware/rate-limit";
import { AIController } from "./ai.controller";

const router: Router = Router();

// Apply rate limiting to AI endpoints (10 requests per minute)
router.use(rateLimiter);
router.use(optionalAuth);

router.post("/identify", AIController.identify);

export default router;
