import { Request, Response, NextFunction } from "express";
import { redirectService } from "./redirect.service";
import { successResponse } from "@linkpulse/common";

export class RedirectController {
  public async handleRedirect(req: Request, res: Response, next: NextFunction) {
    try {
      const shortCode = req.params.shortCode as string;
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "127.0.0.1";

      const result = await redirectService.resolveLink(shortCode, req.headers, ip);

      // If client requests JSON (like frontend resolveShortCode or password prompt check)
      if (req.headers.accept?.includes("application/json") || req.query.json === "true") {
        return res.status(200).json(successResponse(result.link));
      }

      // Fast HTTP 302 Found redirect
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.redirect(302, result.destinationUrl);
    } catch (err) {
      next(err);
    }
  }

  public async getResolvedData(req: Request, res: Response, next: NextFunction) {
    try {
      const shortCode = req.params.shortCode as string;
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.ip || "127.0.0.1";

      const result = await redirectService.resolveLink(shortCode, req.headers, ip);

      return res.status(200).json(successResponse(result.link));
    } catch (err) {
      next(err);
    }
  }
}

export const redirectController = new RedirectController();
