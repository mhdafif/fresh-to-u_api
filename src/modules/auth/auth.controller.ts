import { Request, Response } from "express";

import { AuthService } from "./auth.service";

export class AuthController {
  /**
   * Get current user session
   */
  static async getSession(req: Request, res: Response) {
    console.log("ke get session auth");
    try {
      const sessionCookie = req.cookies.session_id;

      if (!sessionCookie) {
        return res.status(401).json({ error: "No active session" });
      }

      const user = await AuthService.getUserBySession(sessionCookie);

      if (!user) {
        return res.status(401).json({ error: "Invalid session" });
      }

      res.json({
        user: user,
        session: { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get session" });
    }
  }

  /**
   * Google OAuth Sign In
   */
  static async googleSignIn(req: Request, res: Response) {
    try {
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(
          process.env.NODE_ENV === "production"
            ? "https://yourdomain.com/api/auth/google/callback"
            : "http://localhost:4000/api/auth/google/callback"
        )}&` +
        `response_type=code&` +
        `scope=openid email profile&` +
        `access_type=offline`;

      res.redirect(googleAuthUrl);
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate Google OAuth" });
    }
  }

  /**
   * Handle Google OAuth callback
   */
  static async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;

      if (!code) {
        return res
          .status(400)
          .json({ error: "Authorization code not provided" });
      }

      // Exchange authorization code for access token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri:
            process.env.NODE_ENV === "production"
              ? "https://yourdomain.com/api/auth/google/callback"
              : "http://localhost:4000/api/auth/google/callback",
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const tokenData = await tokenResponse.json();
      const { access_token, id_token } = tokenData;

      // Get user info from Google
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to get user info");
      }

      const googleUser = await userResponse.json();

      // Create or update user in database
      const user = await AuthService.createOrUpdateGoogleUser(googleUser);

      // Create session
      const sessionId = AuthService.createSession(user.id);

      // Set session cookie
      res.cookie("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to frontend with success
      res.redirect(
        `http://localhost:4005/profile?auth=success&user=${encodeURIComponent(user.email)}`
      );
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect(
        `http://localhost:4005/profile?auth=error&message=${encodeURIComponent("Failed to authenticate with Google")}`
      );
    }
  }

  /**
   * Sign out user
   */
  static async signOut(req: Request, res: Response) {
    try {
      const sessionCookie = req.cookies.session_id;

      if (sessionCookie) {
        AuthService.deleteSession(sessionCookie);
      }

      res.clearCookie("session_id");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to sign out" });
    }
  }
}
