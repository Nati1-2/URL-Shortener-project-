import { Request, Response, NextFunction } from "express";
import { billingService } from "./billing.service";
import { successResponse } from "@linkpulse/common";

export class BillingController {
  public async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await billingService.getPlans();
      return res.status(200).json(successResponse(plans));
    } catch (err) {
      next(err);
    }
  }

  public async getSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || (req.headers["x-workspace-id"] as string) || "ws_main";
      const sub = await billingService.getSubscription(workspaceId);
      return res.status(200).json(successResponse(sub));
    } catch (err) {
      next(err);
    }
  }

  public async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const { planId, isYearly } = req.body;
      const workspaceId = (req.headers["x-workspace-id"] as string) || "ws_main";
      const result = await billingService.createCheckoutSession(planId, isYearly, workspaceId);
      return res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  public async portal(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.headers["x-workspace-id"] as string) || "ws_main";
      const result = await billingService.openBillingPortal(workspaceId);
      return res.status(200).json(successResponse(result));
    } catch (err) {
      next(err);
    }
  }

  public async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      await billingService.handleStripeWebhook(req.body);
      return res.status(200).json({ received: true });
    } catch (err) {
      next(err);
    }
  }
}

export const billingController = new BillingController();
