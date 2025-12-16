import { Router } from "express";

import { optionalAuth } from "../../middleware/auth.js";
import { GuestController } from "./guest.controller.js";

const router: Router = Router();

router.use(optionalAuth);

router.get("/", GuestController.getOrCreateGuest);

export default router;
