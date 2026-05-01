# Notification System: Frontend Integration Guide

This document provides everything the frontend team needs to integrate real-time notifications, including SSE stream handling and REST API interaction.

## 1. Real-Time Updates (Server-Sent Events)

The system uses **Server-Sent Events (SSE)** to push notifications to the client instantly.

### Connection Details
- **Endpoint**: `GET /api/v1/notifications/stream`
- **Authentication**: Requires a valid `bf_token` cookie (handled automatically by the browser) or the standard auth middleware check.
- **Headers**:
  - `Accept: text/event-stream` (Optional, browser's EventSource handles this)

### Listening for Events (Frontend Example)

```typescript
const setupNotifications = () => {
  const eventSource = new EventSource('/api/v1/notifications/stream', {
    withCredentials: true // Important for cookies
  });

  // 1. Specific User Notifications (Tasks, Submissions, etc.)
  eventSource.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    console.log('New notification received:', notification);
    // Display toast, increment unread count, etc.
  };

  // 2. Heartbeat (Optional debugging)
  // The server sends a ": heartbeat" comment every 30s to keep the socket alive.

  eventSource.onerror = (err) => {
    console.error('SSE connection failed. Reconnecting in 5s...', err);
    eventSource.close();
    setTimeout(setupNotifications, 5000);
  };

  return () => eventSource.close();
};
```

---

## 2. API Reference (REST)

### Get Notification History
Fetch a paginated list of all notifications for the authenticated user (including broadcasts).

- **Route**: `GET /api/v1/notifications`
- **Query Params**:
  - `page`: default `1`
  - `limit`: default `20`
- **Response**:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "type": "SUBMISSION_STATUS",
        "title": "Submission Approved!",
        "message": "Good job! You earned 50.00 USDC.",
        "isRead": false,
        "createdAt": "2026-04-16T12:00:00.000Z",
        "referenceId": "task-uuid"
      }
    ],
    "metadata": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

### Mark Notification as Read
- **Route**: `PATCH /api/v1/notifications/:id/read`
- **Response**: `{ "success": true, "message": "Notification marked as read." }`

### Mark All as Read
- **Route**: `PATCH /api/v1/notifications/read-all`
- **Response**: `{ "success": true, "message": "All notifications marked as read." }`

---

## 3. Data Models & Types

### Notification Object
```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO Date String
  referenceId?: string; // e.g., taskId or submissionId
}

enum NotificationType {
  SYSTEM = "SYSTEM",
  TASK_STATUS = "TASK_STATUS",
  SUBMISSION_STATUS = "SUBMISSION_STATUS",
  PAYOUT_STATUS = "PAYOUT_STATUS",
  ADMIN_BROADCAST = "ADMIN_BROADCAST"
}
```

## 4. Best Practices
1. **Toast Priority**: Display important notifications (Type: `PAYOUT_STATUS`, `SUBMISSION_STATUS`) as immediate toasts.
2. **Persistence**: The SSE stream is for *live* updates. When the user opens their notification center, always fetch the full history from `GET /api/v1/notifications` to ensure no events were missed during offline periods.
3. **Reconnection**: Browser `EventSource` has built-in reconnection logic, but it's good to handle explicit errors by closing and re-instantiating every few minutes if the heartbeat is lost.
