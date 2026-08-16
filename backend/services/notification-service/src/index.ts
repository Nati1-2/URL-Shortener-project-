import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { notificationController } from "./notification.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { eventBroker } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("notification-service");
const app = express();
const PORT = process.env.PORT || 8008;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Correlation ID
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers["x-request-id"] || `req_${Date.now()}`;
  res.setHeader("x-request-id", reqId);
  next();
});

// Health Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "notification-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "notification-service" }));

// Notification Routes (Matches /api/v1/notifications/*)
const router = express.Router();
router.get("/", notificationController.getNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.post("/read-all", notificationController.markAllAsRead);

app.use("/api/v1/notifications", router);
app.use("/notifications", router);

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
  logger.info(`Notification Service running on port ${PORT}`);
  await eventBroker.connect();
});

const shutdown = async () => {
  logger.info("Gracefully shutting down Notification Service...");
  server.close(async () => {
    await eventBroker.close();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
