import { Request } from "express";

export function getSessionId(req: Request): string | null {
  const sessionId = req.headers["x-session-id"] as string;
  return sessionId || null;
}
