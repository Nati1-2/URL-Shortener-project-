import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { successResponse, BadRequestError } from "@linkpulse/common";

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        throw new BadRequestError("Email, password, and name are required.");
      }
      const result = await authService.register({ email, password, name });
      return res.status(201).json(successResponse(result, "Account created successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, rememberMe } = req.body;
      if (!email || !password) {
        throw new BadRequestError("Email and password are required.");
      }
      const result = await authService.login({ email, password, rememberMe });
      return res.status(200).json(successResponse(result, "Logged in successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new BadRequestError("Refresh token is required.");
      }
      const result = await authService.refreshToken(refreshToken);
      return res.status(200).json(successResponse(result, "Token refreshed"));
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      return res.status(200).json(successResponse(null, "Logged out successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || req.headers["x-user-id"];
      if (!userId) {
        return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing user session" } });
      }
      const user = await authService.getUserById(String(userId));
      return res.status(200).json(successResponse(user));
    } catch (err) {
      next(err);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) throw new BadRequestError("Email is required.");
      await authService.forgotPassword(email);
      return res.status(200).json(successResponse(null, "If an account exists, instructions have been sent."));
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        throw new BadRequestError("Token and newPassword are required.");
      }
      await authService.resetPassword(token, newPassword);
      return res.status(200).json(successResponse(null, "Password reset successfully."));
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
