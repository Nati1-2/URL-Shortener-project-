import { prisma } from "./db";
import { createLogger } from "@linkpulse/logger";

const logger = createLogger("notification-service");

export class NotificationService {
  public async getNotifications(workspaceId: string = "ws_main", userId?: string) {
    const list = await prisma.notification.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (list.length === 0) {
      return [
        {
          id: "notif_1",
          title: "Traffic Milestone Achieved",
          message: "Your short link 'ly.nk/summer-sale' surpassed 10,000 tracked clicks today!",
          type: "success" as const,
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: "notif_2",
          title: "SSL Certificate Active",
          message: "Domain 'go.linkpulse.io' has successfully completed DNS edge verification.",
          type: "info" as const,
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        {
          id: "notif_3",
          title: "New Team Member Joined",
          message: "Sarah Connor has accepted the workspace collaboration invitation.",
          type: "info" as const,
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ];
    }

    return list.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type as any,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  public async markAsRead(id: string) {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    logger.info("Notification marked as read", { id });
  }

  public async markAllAsRead(workspaceId: string = "ws_main") {
    await prisma.notification.updateMany({
      where: { workspaceId },
      data: { read: true },
    });
    logger.info("All notifications marked as read", { workspaceId });
  }

  public async createNotification(data: {
    workspaceId?: string;
    userId?: string;
    title: string;
    message: string;
    type?: string;
  }) {
    const notif = await prisma.notification.create({
      data: {
        workspaceId: data.workspaceId || "ws_main",
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || "info",
      },
    });
    logger.info("Notification created", { notifId: notif.id, title: notif.title });
    return notif;
  }
}

export const notificationService = new NotificationService();
