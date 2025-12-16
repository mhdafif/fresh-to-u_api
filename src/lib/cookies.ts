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

export function getClientIpAddress(req: Request): string | null {
  // Try to get IP address from various headers
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    return (forwardedFor as string).split(",")[0].trim();
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return realIp as string;
  }

  const cfConnectingIp = req.headers["cf-connecting-ip"]; // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp as string;
  }

  const xClientIp = req.headers["x-client-ip"];
  if (xClientIp) {
    return xClientIp as string;
  }

  // Fallback to connection remoteAddress
  return req.connection?.remoteAddress || req.socket?.remoteAddress;
}
