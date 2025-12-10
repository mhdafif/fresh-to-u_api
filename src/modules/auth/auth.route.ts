import { Router } from "express";

import { AuthController } from "./auth.controller.js";

const router: Router = Router();

// Session management
router.get("/session", AuthController.getSession);

// Google OAuth routes
router.get("/google/signin", AuthController.googleSignIn);
router.get("/google/callback", AuthController.googleCallback);

// Sign out
router.post("/signout", AuthController.signOut);

export default router;
