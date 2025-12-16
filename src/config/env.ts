import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((value) => Number(value))
    .default(4000),
  DATABASE_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  CORS_ORIGIN: z.string(),
  R2_ENDPOINT: z.string(),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET_NAME: z.string(),
  R2_PUBLIC_URL: z.string(),
  FREE_USER_DAILY_SCAN_LIMIT: z
    .string()
    .transform((value) => Number(value))
    .default(15),
  GUEST_USER_DAILY_SCAN_LIMIT: z
    .string()
    .transform((value) => Number(value))
    .default(10),
  // REDIS_URL: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
