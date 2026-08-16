import { Request, Response, NextFunction } from "express";
import { notificationService } from "./notification.service";
import { successResponse } from "@linkpulse/common";

export class NotificationController {
  public async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.query.workspaceId as string) || (req.headers["x-workspace-id"] as string) || "ws_main";
      const userId = req.headers["x-user-id"] as string;
      const list = await notificationService.getNotifications(workspaceId, userId);
      return res.status(200).json(successResponse(list));
    } catch (err) {
      next(err);
    }
  }

  public async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(id);
      return res.status(200).json(successResponse(null, "Notification marked as read"));
    } catch (err) {
      next(err);
    }
  }

  public async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = (req.headers["x-workspace-id"] as string) || "ws_main";
      await notificationService.markAllAsRead(workspaceId);
      return res.status(200).json(successResponse(null, "All notifications marked as read"));
    } catch (err) {
      next(err);
    }
  }
}

export const notificationController = new NotificationController();
