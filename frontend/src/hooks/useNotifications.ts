import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";

export const NOTIFICATION_QUERY_KEYS = {
  all: ["notifications"] as const,
  list: () => [...NOTIFICATION_QUERY_KEYS.all, "list"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(),
    queryFn: () => notificationService.getNotifications(),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
  });
}
