import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { billingController } from "./billing.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { eventBroker } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("billing-service");
const app = express();
const PORT = process.env.PORT || 8007;

app.use(helmet());
app.use(cors());
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Correlation ID
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers["x-request-id"] || `req_${Date.now()}`;
  res.setHeader("x-request-id", reqId);
  next();
});

// Health Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "billing-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "billing-service" }));

// Billing Routes (Matches /api/v1/billing/*)
const router = express.Router();
router.get("/plans", billingController.getPlans);
router.get("/subscription", billingController.getSubscription);
router.post("/checkout", billingController.checkout);
router.post("/portal", billingController.portal);
router.post("/webhook", billingController.webhook);

app.use("/api/v1/billing", router);
app.use("/billing", router);

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
  logger.info(`Billing Service running on port ${PORT}`);
  await eventBroker.connect();
});

const shutdown = async () => {
  logger.info("Gracefully shutting down Billing Service...");
  server.close(async () => {
    await eventBroker.close();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
