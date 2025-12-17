import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import aiRoutes from "./modules/ai/ai.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import foodRoutes from "./modules/food/food.route.js";
import guestRoutes from "./modules/guest/guest.route.js";
import historyRoutes from "./modules/history/history.route.js";
import scanLimitRoutes from "./modules/scan-limit/scan-limit.route.js";
import seasonalRoutes from "./modules/seasonal/seasonal.route.js";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
// Morgan logger
app.use(morgan("combined"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/scan-limit", scanLimitRoutes);
app.use("/api/seasonal", seasonalRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
