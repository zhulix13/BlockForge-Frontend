import type { Role, SubmissionStatus } from "./shared.types";
import type { Task, TaskStep } from "./task.types";

export interface SubmissionProof {
  id: string;
  submissionId: string;
  taskStepId: string;
  proofLink: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  status: SubmissionStatus;
  screenshotUrl: string;
  reviewedById?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  proofs?: SubmissionProof[];
  user?: {
    createdAt: any;
    id: string;
    username: string;
    displayName?: string;
    profileImage?: string;
    role: Role;
    xId: string;
  };
  task?: Task;
}

export interface CreateSubmissionInput {
  taskId: string;
  screenshotUrl: string;
  proofs: Array<{
    taskStepId: string;
    proofLink: string;
  }>;
}

export interface ReviewSubmissionInput {
  status: "APPROVED" | "REJECTED";
  feedback?: string;
}

export interface UploadUrlInput {
  contentType: "image/png" | "image/jpeg" | "image/jpg" | "image/webp";
  fileName: string;
  taskId: string;
}

export interface UploadUrlResponse {
  url: string;
  fields?: Record<string, string>;
  key: string;
}
