import { Request, Response, NextFunction } from "express";

export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const reqId = (req.headers["x-request-id"] as string) || `req_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
  const correlationId = (req.headers["x-correlation-id"] as string) || reqId;

  req.headers["x-request-id"] = reqId;
  req.headers["x-correlation-id"] = correlationId;

  res.setHeader("x-request-id", reqId);
  res.setHeader("x-correlation-id", correlationId);

  next();
}
