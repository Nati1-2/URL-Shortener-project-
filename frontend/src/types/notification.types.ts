export type NotificationType = "info" | "success" | "warning" | "error" | "security" | "usage";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  emailDigest: boolean;
  expiryAlerts: boolean;
  trafficSurgeAlerts: boolean;
  securityAlerts: boolean;
}
