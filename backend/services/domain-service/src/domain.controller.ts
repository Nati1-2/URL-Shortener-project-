import { Request, Response, NextFunction } from "express";
import { domainService } from "./domain.service";
import { successResponse, BadRequestError } from "@linkpulse/common";

export class DomainController {
  public async getDomains(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || (req.headers["x-workspace-id"] as string) || "ws_main";
      const domains = await domainService.getDomains(workspaceId);
      return res.status(200).json(successResponse(domains));
    } catch (err) {
      next(err);
    }
  }

  public async addDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const { hostname, workspaceId } = req.body;
      if (!hostname) throw new BadRequestError("Hostname is required.");
      const domain = await domainService.addDomain({
        hostname,
        workspaceId: workspaceId || (req.headers["x-workspace-id"] as string),
      });
      return res.status(201).json(successResponse(domain, "Domain added successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async verifyDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await domainService.verifyDomain(id);
      return res.status(200).json(successResponse(result, "Domain verified successfully"));
    } catch (err) {
      next(err);
    }
  }

  public async deleteDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await domainService.deleteDomain(id);
      return res.status(200).json(successResponse(null, "Domain deleted successfully"));
    } catch (err) {
      next(err);
    }
  }
}

export const domainController = new DomainController();
