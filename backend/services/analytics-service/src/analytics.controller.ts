import { Request, Response, NextFunction } from "express";
import { analyticsService } from "./analytics.service";
import { successResponse } from "@linkpulse/common";

export class AnalyticsController {
  public async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || (req.headers["x-workspace-id"] as string) || "ws_main";
      const linkId = req.query.linkId as string;
      const data = await analyticsService.getOverview(workspaceId, linkId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }

  public async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || "ws_main";
      const timeframe = (req.query.timeframe as string) || "30d";
      const linkId = req.query.linkId as string;
      const data = await analyticsService.getTimeline(workspaceId, timeframe, linkId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }

  public async getGeography(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || "ws_main";
      const linkId = req.query.linkId as string;
      const data = await analyticsService.getGeography(workspaceId, linkId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }

  public async getDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || "ws_main";
      const linkId = req.query.linkId as string;
      const data = await analyticsService.getDevices(workspaceId, linkId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }

  public async getBrowsers(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || "ws_main";
      const linkId = req.query.linkId as string;
      const data = await analyticsService.getBrowsers(workspaceId, linkId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }

  public async getReferrers(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || "ws_main";
      const linkId = req.query.linkId as string;
      const data = await analyticsService.getReferrers(workspaceId, linkId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }

  public async getLiveFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || "ws_main";
      const data = await analyticsService.getLiveClicks(workspaceId);
      return res.status(200).json(successResponse(data));
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
