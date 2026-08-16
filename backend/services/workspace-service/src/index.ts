import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { workspaceController } from "./workspace.controller";
import { errorResponse, AppError } from "@linkpulse/common";
import { eventBroker } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("workspace-service");
const app = express();
const PORT = process.env.PORT || 8005;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Correlation ID Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId = req.headers["x-request-id"] || `req_${Date.now()}`;
  res.setHeader("x-request-id", reqId);
  next();
});

// Health Checks
app.get("/health", (req, res) => res.status(200).json({ status: "healthy", service: "workspace-service" }));
app.get("/ready", (req, res) => res.status(200).json({ status: "ready", service: "workspace-service" }));

// Workspace Routes
const router = express.Router();
router.get("/", workspaceController.getWorkspaces);
router.post("/", workspaceController.createWorkspace);
router.get("/:id", workspaceController.getWorkspaceById);
router.get("/:workspaceId/members", workspaceController.getMembers);
router.post("/:workspaceId/invitations", workspaceController.inviteMember);
router.patch("/:workspaceId/members/:memberId", workspaceController.updateMemberRole);
router.delete("/:workspaceId/members/:memberId", workspaceController.removeMember);

app.use("/api/v1/workspaces", router);
app.use("/workspaces", router);

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
  logger.info(`Workspace Service running on port ${PORT}`);
  await eventBroker.connect();
});

const shutdown = async () => {
  logger.info("Gracefully shutting down Workspace Service...");
  server.close(async () => {
    await eventBroker.close();
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
