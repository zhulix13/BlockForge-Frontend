import type { SubmissionStatus } from './shared.types';

export interface SubmissionProof {
  id: string;
  submissionId: string;
  taskStepId: string;
  url: string;
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
}

export interface CreateSubmissionInput {
  taskId: string;
  screenshotUrl: string;
  proofs: Array<{
    taskStepId: string;
    url: string;
  }>;
}

export interface ReviewSubmissionInput {
  status: 'APPROVED' | 'REJECTED';
  feedback?: string;
}

export interface UploadUrlInput {
  contentType: 'image/png' | 'image/jpeg' | 'image/jpg' | 'image/webp';
  fileName: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
}
