import { z } from "zod";

export interface ScanLimitCheckRequest {
  userId?: string;
  guestId?: string;
}

export interface ScanLimitCreateRequest {
  userId?: string;
  guestId?: string;
  dailyLimit: number;
}

export interface ScanLimitUpdateRequest {
  userId?: string;
  guestId?: string;
  remaining: number;
}

// export const scanLimitCheckSchema = z.object({
//   userId: z.string().optional(),
//   guestId: z.string().optional(),
// });

// export const scanLimitCreateSchema = z.object({
//   userId: z.string().optional(),
//   guestId: z.string().optional(),
//   total: z.number().min(1, "Total limit must be at least 1"),
// });

// export const scanLimitUpdateSchema = z.object({
//   userId: z.string().optional(),
//   guestId: z.string().optional(),
//   remaining: z.number().min(0, "Remaining must be non-negative"),
// });
