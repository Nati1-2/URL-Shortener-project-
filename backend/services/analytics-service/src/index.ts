import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { analyticsController } from "./analytics.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("analytics-service");
const app = express();
const PORT = process.env.PORT || 8004;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request Correlation ID Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers["x-request-id"] || `req_${Date.now()}`;
  res.setHeader("x-request-id", reqId);
  next();
});

// Health Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "analytics-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "analytics-service" }));

// Analytics Routes (Matches /api/v1/analytics/*)
const router = express.Router();
router.get("/overview", analyticsController.getOverview);
router.get("/timeline", analyticsController.getTimeline);
router.get("/geography", analyticsController.getGeography);
router.get("/devices", analyticsController.getDevices);
router.get("/browsers", analyticsController.getBrowsers);
router.get("/referrers", analyticsController.getReferrers);
router.get("/live-feed", analyticsController.getLiveFeed);

app.use("/api/v1/analytics", router);
app.use("/analytics", router);

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || (err instanceof AppError ? err.statusCode : 500);
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "An unexpected error occurred.";
  const requestId = String(res.getHeader("x-request-id") || "");

  logger.error("Request Error", err, {
    route: req.path,
    method: req.method,
    statusCode,
    requestId,
  });

  return res.status(statusCode).json(errorResponse(code, message, err.details, requestId));
});

const server = app.listen(PORT, async () => {
  logger.info(`Analytics Service running on port ${PORT}`);
});

const shutdown = async () => {
  logger.info("Gracefully shutting down Analytics Service...");
  server.close(async () => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
