import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { domainController } from "./domain.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("domain-service");
const app = express();
const PORT = process.env.PORT || 8006;

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
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "domain-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "domain-service" }));

// Domain Routes (Matches /api/v1/domains/*)
const router = express.Router();
router.get("/", domainController.getDomains);
router.post("/", domainController.addDomain);
router.post("/:id/verify", domainController.verifyDomain);
router.delete("/:id", domainController.deleteDomain);

app.use("/api/v1/domains", router);
app.use("/domains", router);

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
  logger.info(`Domain Service running on port ${PORT}`);
});

const shutdown = async () => {
  logger.info("Gracefully shutting down Domain Service...");
  server.close(async () => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
