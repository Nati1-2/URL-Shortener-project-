import jwt from "jsonwebtoken";
import { UserPayload, JwtTokens } from "./types";

const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "CRITICAL SECURITY ERROR: JWT_ACCESS_SECRET environment variable is missing. " +
      "Set it in your .env file (see backend/.env.example)."
    );
  }
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error(
      "CRITICAL SECURITY ERROR: JWT_REFRESH_SECRET environment variable is missing. " +
      "Set it in your .env file (see backend/.env.example)."
    );
  }
  return secret;
}

export function generateTokens(payload: UserPayload): JwtTokens {
  const accessToken = jwt.sign(payload, getAccessSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ id: payload.id, email: payload.email }, getRefreshSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
}

export function verifyAccessToken(token: string): UserPayload {
  return jwt.verify(token, getAccessSecret()) as UserPayload;
}

export function verifyRefreshToken(token: string): { id: string; email: string } {
  return jwt.verify(token, getRefreshSecret()) as { id: string; email: string };
}
