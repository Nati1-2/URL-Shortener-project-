import crypto from "crypto";
import { prisma } from "./db";
import {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "@linkpulse/common";
import { eventBroker, EVENT_TOPICS } from "@linkpulse/events";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("auth-service");

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  public async register(input: { email: string; password: string; name: string }) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError("An account with this email address already exists.");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      },
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    // Store hashed refresh token
    const tokenHash = hashToken(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Publish User Registered Notification Event
    await eventBroker.publish(EVENT_TOPICS.NOTIFICATION_REQUESTED, {
      eventId: `evt_${crypto.randomUUID()}`,
      eventType: "NOTIFICATION_REQUESTED",
      timestamp: new Date().toISOString(),
      source: "auth-service",
      version: "1.0",
      payload: {
        userId: user.id,
        title: "Welcome to LinkPulse!",
        message: "Your workspace is ready. Start shortening links and tracking real-time analytics.",
        type: "success",
      },
    });

    logger.info("User registered successfully", { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  }

  public async login(input: { email: string; password: string; rememberMe?: boolean }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    const tokenHash = hashToken(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + (input.rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000),
      },
    });

    logger.info("User logged in successfully", { userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatarUrl,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  }

  public async refreshToken(refreshTokenStr: string) {
    try {
      const decoded = verifyRefreshToken(refreshTokenStr);
      const tokenHash = hashToken(refreshTokenStr);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedError("Refresh token is invalid or has expired.");
      }

      // Refresh token rotation: revoke used token
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });

      const tokens = generateTokens({
        id: storedToken.user.id,
        email: storedToken.user.email,
        name: storedToken.user.name,
        role: storedToken.user.role as any,
      });

      // Store new refresh token hash
      await prisma.refreshToken.create({
        data: {
          tokenHash: hashToken(tokens.refreshToken),
          userId: storedToken.user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        user: {
          id: storedToken.user.id,
          email: storedToken.user.email,
          name: storedToken.user.name,
          avatar: storedToken.user.avatarUrl,
          role: storedToken.user.role,
          createdAt: storedToken.user.createdAt.toISOString(),
        },
        tokens,
      };
    } catch {
      throw new UnauthorizedError("Session expired. Please log in again.");
    }
  }

  public async logout(refreshTokenStr?: string) {
    if (refreshTokenStr) {
      const tokenHash = hashToken(refreshTokenStr);
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      });
    }
  }

  public async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatarUrl,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    };
  }

  public async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashToken(resetToken);

      await prisma.passwordReset.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      logger.info(`Password reset requested for ${email}. Token: ${resetToken}`);
    }
  }

  public async resetPassword(token: string, newPass: string) {
    const tokenHash = hashToken(token);
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      throw new BadRequestError("Invalid or expired password reset token.");
    }

    const newHash = await hashPassword(newPass);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newHash },
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { isUsed: true },
    });

    logger.info(`Password successfully reset for userId: ${resetRecord.userId}`);
  }
}

export const authService = new AuthService();
