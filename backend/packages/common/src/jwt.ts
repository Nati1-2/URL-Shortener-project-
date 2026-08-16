import jwt from "jsonwebtoken";
import { UserPayload, JwtTokens } from "./types";

const DEFAULT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret_change_me";
const DEFAULT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret_change_me";

const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

export function generateTokens(payload: UserPayload): JwtTokens {
  const accessToken = jwt.sign(payload, DEFAULT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id: payload.id, email: payload.email }, DEFAULT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
}

export function verifyAccessToken(token: string): UserPayload {
  return jwt.verify(token, DEFAULT_ACCESS_SECRET) as UserPayload;
}

export function verifyRefreshToken(token: string): { id: string; email: string } {
  return jwt.verify(token, DEFAULT_REFRESH_SECRET) as { id: string; email: string };
}
