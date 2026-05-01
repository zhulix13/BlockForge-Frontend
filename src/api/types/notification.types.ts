export type NotificationType = 
  | 'SYSTEM' 
  | 'TASK_STATUS' 
  | 'SUBMISSION_STATUS' 
  | 'PAYOUT_STATUS' 
  | 'ADMIN_BROADCAST';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastNotificationInput {
  title: string;
  message: string;
}
