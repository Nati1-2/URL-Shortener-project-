import { apiClient } from "./api-client";
import { API_ROUTES } from "@/config/microservices";
import { ENV } from "@/config/env";
import { mockDataStore } from "./mock/mockDataStore";
import { NotificationItem, ApiResponse } from "@/types";

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (ENV.USE_MOCK_API) {
      return mockDataStore.getNotifications();
    }
    const res = await apiClient.get<ApiResponse<NotificationItem[]>>(
      API_ROUTES.NOTIFICATIONS.BASE
    );
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    if (ENV.USE_MOCK_API) {
      const notif = mockDataStore.getNotifications().find((n) => n.id === id);
      if (notif) notif.read = true;
      return;
    }
    await apiClient.patch(API_ROUTES.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllAsRead(): Promise<void> {
    if (ENV.USE_MOCK_API) {
      mockDataStore.getNotifications().forEach((n) => (n.read = true));
      return;
    }
    await apiClient.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },
};
