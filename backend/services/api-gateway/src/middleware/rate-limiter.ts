import rateLimit from "express-rate-limit";
import { errorResponse } from "@linkpulse/common";

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json(
      errorResponse(
        "TOO_MANY_REQUESTS",
        "API rate limit exceeded. Please retry in 60 seconds.",
        undefined,
        res.getHeader("x-request-id") as string
      )
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json(
      errorResponse(
        "AUTH_RATE_LIMITED",
        "Too many authentication attempts. Please try again in 15 minutes.",
        undefined,
        res.getHeader("x-request-id") as string
      )
    );
  },
});
