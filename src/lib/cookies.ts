import { Request } from "express";

export function getGuestId(req: Request): string | null {
  // console.log("req.headers", req.headers);
  const cookieGuestId = (req as any).cookies?.guestId;
  if (cookieGuestId) {
    return cookieGuestId;
  }

  // Fallback to header for backward compatibility
  const headerGuestId = req.headers["x-guest-id"] as string;
  return headerGuestId || null;
}
