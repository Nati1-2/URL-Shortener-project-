import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { NotificationItem, ApiResponse } from "@/types";

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await apiClient.get<ApiResponse<NotificationItem[]>>(
      API_ROUTES.NOTIFICATIONS.BASE
    );
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(API_ROUTES.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },
};
