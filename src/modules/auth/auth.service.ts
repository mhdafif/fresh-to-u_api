// Temporarily disable better-auth for simpler implementation
// import { betterAuth } from "better-auth";
// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000/api/auth/auth",
//   secret: process.env.BETTER_AUTH_SECRET,
//   emailAndPassword: {
//     enabled: false, // Disable email/password as requested
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       enabled: true,
//     },
//   },
//   session: {
//     expiresIn: 60 * 60 * 24 * 7, // 7 days
//     updateAge: 60 * 60 * 24 * 1, // 1 day
//     cookieCache: {
//       enabled: true,
//       maxAge: 60 * 5, // 5 minutes
//     },
//   },
//   account: {
//     linkOnAccountCreation: true, // Link with existing user if found
//     linkOnSignIn: true,
//   },
//   advanced: {
//     generateId: true, // Use better-auth's ID generation
//     crossSubDomainCookies: {
//       enabled: false,
//     },
//   },
// });
import { randomUUID } from "crypto";

import { prisma } from "../../prisma.js";

// In-memory session storage (for demo purposes)
// In production, you'd want to use Redis or database
const sessions = new Map<string, { userId: string; expiresAt: Date }>();

export class AuthService {
  /**
   * Create or update user from Google OAuth
   */
  static async createOrUpdateGoogleUser(googleUser: any) {
    let dbUser = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!dbUser) {
      // Create new user (no passwordHash for OAuth users)
      dbUser = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email,
          image: googleUser.picture,
          emailVerified: googleUser.verified_email || true,
        },
      });
    } else {
      // Update existing user
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          name: googleUser.name || dbUser.name,
          image: googleUser.picture || dbUser.image,
          emailVerified: googleUser.verified_email || dbUser.emailVerified,
        },
      });
    }

    // Create or update Google account record
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: dbUser.id,
        provider: "google",
      },
    });

    if (!existingAccount) {
      await prisma.account.create({
        data: {
          userId: dbUser.id,
          type: "oauth",
          provider: "google",
          providerAccountId: googleUser.id.toString(),
          token_type: "Bearer",
          scope: "openid email profile",
        },
      });
    }

    return dbUser;
  }

  /**
   * Create session for user
   */
  static createSession(userId: string): string {
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    sessions.set(sessionId, { userId, expiresAt });

    // Clean up expired sessions
    this.cleanupExpiredSessions();

    return sessionId;
  }

  /**
   * Get user by session ID
   */
  static async getUserBySession(sessionId: string) {
    const session = sessions.get(sessionId);

    if (!session || session.expiresAt < new Date()) {
      sessions.delete(sessionId);
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions() {
    const now = new Date();
    for (const [sessionId, session] of sessions.entries()) {
      if (session.expiresAt < now) {
        sessions.delete(sessionId);
      }
    }
  }

  /**
   * Delete session
   */
  static deleteSession(sessionId: string) {
    sessions.delete(sessionId);
  }
}
