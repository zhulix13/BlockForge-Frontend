import type { TaskLevel, TaskStatus, StepType } from './shared.types';

export interface TaskStep {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  type: StepType;
  targetUrl: string;
  requiresLink: boolean;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  level: TaskLevel;
  rewardMicrounits: number; // BigInt on backend, number on frontend
  maxCompletions: number;
  completedCount: number;
  status: TaskStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  steps?: TaskStep[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  level: TaskLevel;
  rewardUsdc: number; // Will be converted to microunits on backend or before sending
  maxCompletions: number;
  steps: Array<{
    title: string;
    description?: string;
    type: StepType;
    targetUrl: string;
    requiresLink: boolean;
    order: number;
  }>;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  level?: TaskLevel;
  rewardUsdc?: number;
  maxCompletions?: number;
  status?: TaskStatus;
}
