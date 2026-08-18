import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { correlationIdMiddleware } from "./middleware/correlation-id";
import { globalRateLimiter } from "./middleware/rate-limiter";
import { setupProxyRoutes } from "./routes";
import { errorResponse } from "@linkpulse/common";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("api-gateway");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(correlationIdMiddleware);
app.use(globalRateLimiter);

// Health & Liveness Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "api-gateway" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "api-gateway" }));

// Mount Reverse Proxy Routes
setupProxyRoutes(app);

// Gateway Fallback Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 502;
  const code = err.code || "GATEWAY_ERROR";
  const message = err.message || "Microservice communication failed.";
  const requestId = String(res.getHeader("x-request-id") || "");

  logger.error("API Gateway Proxy Error", err, {
    route: req.path,
    method: req.method,
    statusCode,
    requestId,
  });

  return res.status(statusCode).json(errorResponse(code, message, undefined, requestId));
});

const server = app.listen(PORT, () => {
  logger.info(`LinkPulse API Gateway listening on port ${PORT}`);
});

const shutdown = () => {
  logger.info("Gracefully shutting down API Gateway...");
  server.close(() => process.exit(0));
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
