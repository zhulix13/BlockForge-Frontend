import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../endpoints/notification.api";
import type { BroadcastNotificationInput } from "../types/notification.types";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: any) => [...notificationKeys.lists(), params] as const,
};

export function useGetNotifications(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.getNotifications(params),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useBroadcastNotification() {
  return useMutation({
    mutationFn: (data: BroadcastNotificationInput) => notificationApi.broadcast(data),
  });
}
