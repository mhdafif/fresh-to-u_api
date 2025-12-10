import { NextFunction, Request, Response } from "express";

import { AuthService } from "../modules/auth/auth.service.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
  session?: any;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionCookie = req.cookies.session_id;

    if (!sessionCookie) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await AuthService.getUserBySession(sessionCookie);

    if (!user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    req.user = user;
    req.session = { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }; // 7 days
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid session" });
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionCookie = req.headers["x-session-id"] || req.cookies.session_id;
    if (sessionCookie) {
      const user = await AuthService.getUserBySession(sessionCookie);
      if (user) {
        req.user = user;
        req.session = {
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }; // 7 days
      }
    }
  } catch (error) {
    // Ignore errors for optional auth
  }

  next();
};
