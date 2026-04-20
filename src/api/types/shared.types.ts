export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
} as const;
export type Role = typeof Role[keyof typeof Role];

export const TaskLevel = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;
export type TaskLevel = typeof TaskLevel[keyof typeof TaskLevel];

export const TaskStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const StepType = {
  FOLLOW: 'FOLLOW',
  LIKE: 'LIKE',
  RETWEET: 'RETWEET',
  COMMENT: 'COMMENT',
} as const;
export type StepType = typeof StepType[keyof typeof StepType];

export const SubmissionStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type SubmissionStatus = typeof SubmissionStatus[keyof typeof SubmissionStatus];

export const WithdrawalStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const;
export type WithdrawalStatus = typeof WithdrawalStatus[keyof typeof WithdrawalStatus];

export const NotificationType = {
  SYSTEM: 'SYSTEM',
  TASK_STATUS: 'TASK_STATUS',
  SUBMISSION_STATUS: 'SUBMISSION_STATUS',
  PAYOUT_STATUS: 'PAYOUT_STATUS',
  ADMIN_BROADCAST: 'ADMIN_BROADCAST',
} as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const TransactionType = {
  TASK_REWARD: 'TASK_REWARD',
  WITHDRAWAL_REQUEST: 'WITHDRAWAL_REQUEST',
  WITHDRAWAL_REVERSAL: 'WITHDRAWAL_REVERSAL',
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
