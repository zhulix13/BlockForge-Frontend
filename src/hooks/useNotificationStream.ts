import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../store/toastStore";
import { notificationKeys } from "../api/hooks/notification.hooks";
import { type Notification } from "../api/types/notification.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export function useNotificationStream() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Connect to SSE stream
    const eventSource = new EventSource(`${API_URL}/notifications/stream`, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data);

        // 1. Show toast
        toast.info(notification.title, notification.message);

        // 2. Invalidate notification list query
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      } catch (error) {
        console.error("Error parsing notification:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Connection Error:", error);
      // EventSource automatically retries, so we don't need to manually reconnect here
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, user, queryClient, toast]);
}
