import type {
  TaskLevel,
  TaskStatus,
  StepType,
  SubmissionStatus,
} from "./shared.types";

export interface TaskStep {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  type: StepType;
  targetUrl: string;
  requiresLink: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _count: any;
  id: string;
  title: string;
  description?: string;
  level: TaskLevel;
  rewardUsdc: string; // From the backend formatTask helper
  maxCompletions: number;
  completedCount: number;
  status: TaskStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  steps?: TaskStep[];
  userSubmissionStatus?: SubmissionStatus | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  level: TaskLevel;
  rewardUsdc: number; // Input is a number for the form
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
