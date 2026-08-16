import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { authController } from "./auth.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { eventBroker } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("auth-service");
const app = express();
const PORT = process.env.PORT || 8001;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Correlation ID & Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers["x-request-id"] || `req_${Date.now()}`;
  res.setHeader("x-request-id", reqId);
  next();
});

// Health Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "auth-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "auth-service" }));

// Auth Routes (Matches API Gateway /api/v1/auth/*)
const router = express.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authController.me);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

app.use("/api/v1/auth", router);
app.use("/auth", router); // Direct fallback

// Global Error Handler
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
  logger.info(`Auth Service running on port ${PORT}`);
  await eventBroker.connect();
});

// Graceful Shutdown
const shutdown = async () => {
  logger.info("Gracefully shutting down Auth Service...");
  server.close(async () => {
    await eventBroker.close();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
