import axiosInstance from "../axiosInstance";
import type { PaginatedResponse, ApiResponse } from "../types/shared.types";
import type { Notification, BroadcastNotificationInput } from "../types/notification.types";

export const notificationApi = {
  /**
   * Fetch paginated notification history for the authenticated user.
   */
  getNotifications: async (params: { page?: number; limit?: number } = {}) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Notification>>>("/notifications", {
      params,
    });
    return response.data;
  },

  /**
   * Mark a single notification as read.
   */
  markRead: async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications for the authenticated user as read.
   */
  markAllRead: async () => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>("/notifications/read-all");
    return response.data;
  },

  /**
   * Admin: Send a broadcast notification to all users.
   */
  broadcast: async (data: BroadcastNotificationInput) => {
    const response = await axiosInstance.post<ApiResponse<{ title: string; message: string; userCount: number }>>(
      "/notifications/broadcast",
      data
    );
    return response.data;
  },
};
