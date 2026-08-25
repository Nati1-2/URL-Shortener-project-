import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, errorResponse } from "@linkpulse/common";

const PUBLIC_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/billing/webhook",
  "/billing/webhook",
  "/api/v1/redirect",
  "/health",
  "/ready",
];

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const path = req.path;
  const isPublic =
    PUBLIC_PATHS.some((p) => path.startsWith(p)) ||
    path.startsWith("/api/v1/redirect") ||
    path.startsWith("/redirect");
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (isPublic) {
      return next();
    }
    return res.status(401).json(errorResponse("UNAUTHORIZED", "Authentication required to access this resource."));
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    req.headers["x-user-id"] = payload.id;
    req.headers["x-user-email"] = payload.email;
    req.headers["x-user-name"] = payload.name;
    req.headers["x-user-role"] = payload.role || "OWNER";
    req.headers["x-workspace-id"] = (req.headers["x-workspace-id"] as string) || payload.workspaceId || "ws_main";
    return next();
  } catch {
    if (isPublic) {
      return next();
    }
    return res.status(401).json(errorResponse("TOKEN_EXPIRED", "Session expired or token invalid. Please log in again."));
  }
}
