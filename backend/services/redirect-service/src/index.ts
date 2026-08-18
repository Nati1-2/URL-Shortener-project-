import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { redirectController } from "./redirect.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { eventBroker } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("redirect-service");
const app = express();
const PORT = process.env.PORT || 8003;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Health Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "redirect-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "redirect-service" }));

// Redirect Resolver API (Matched by Gateway /api/v1/redirect/:shortCode)
app.get("/api/v1/redirect/:shortCode", redirectController.getResolvedData);
app.get("/redirect/:shortCode", redirectController.getResolvedData);

// Direct edge short URL redirect
app.get("/:shortCode", redirectController.handleRedirect);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || (err instanceof AppError ? err.statusCode : 500);
  const code = err.code || "REDIRECT_ERROR";
  const message = err.message || "Failed to resolve destination URL.";

  logger.error("Redirect Error", err, { route: req.path, statusCode });

  if (req.headers.accept?.includes("text/html")) {
    return res.status(statusCode).send(`
      <!DOCTYPE html>
      <html>
        <head><title>LinkPulse - Redirect Error</title></head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0b0f19; color: #fff;">
          <div style="text-align: center; max-width: 480px; padding: 32px; background: #151d30; border-radius: 20px; border: 1px solid #2a3754;">
            <h2 style="color: #ef4444; margin-bottom: 8px;">Link Unavailable</h2>
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">${message}</p>
            <a href="http://localhost:3000" style="background: #3b82f6; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-weight: bold;">Return to Home</a>
          </div>
        </body>
      </html>
    `);
  }

  return res.status(statusCode).json(errorResponse(code, message));
});

const server = app.listen(PORT, async () => {
  logger.info(`Redirect Service running on port ${PORT}`);
  await eventBroker.connect();
});

const shutdown = async () => {
  logger.info("Gracefully shutting down Redirect Service...");
  server.close(async () => {
    await eventBroker.close();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
