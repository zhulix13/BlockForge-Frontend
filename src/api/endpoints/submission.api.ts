import axiosInstance from '../axiosInstance';
import type { Submission, CreateSubmissionInput, UploadUrlInput, UploadUrlResponse, ReviewSubmissionInput } from '../types/submission.types';
import type { ApiResponse, PaginatedResponse } from '../types/shared.types';

export const submissionApi = {
  getMySubmissions: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Submission>>>('/submissions/my', { params });
    return response.data;
  },

  getMySubmissionById: async (submissionId: string) => {
    const response = await axiosInstance.get<ApiResponse<Submission>>(`/submissions/my/${submissionId}`);
    return response.data;
  },

  getUploadUrl: async (input: UploadUrlInput) => {
    const response = await axiosInstance.post<ApiResponse<UploadUrlResponse>>('/submissions/upload-url', input);
    return response.data;
  },

  getPendingSubmissions: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Submission>>>('/submissions/admin/pending', { params });
    return response.data;
  },

  getSubmissionById: async (submissionId: string) => {
    const response = await axiosInstance.get<ApiResponse<Submission>>(`/submissions/admin/${submissionId}`);
    return response.data;
  },

  getTaskSubmissions: async (taskId: string, params?: { page?: number; limit?: number; status?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Submission>>>(`/submissions/admin/task/${taskId}`, { params });
    return response.data;
  },

  reviewSubmission: async (submissionId: string, input: ReviewSubmissionInput) => {
    const response = await axiosInstance.post<ApiResponse<Submission>>(`/submissions/admin/${submissionId}/review`, input);
    return response.data;
  },

  createSubmission: async (input: CreateSubmissionInput) => {
    const response = await axiosInstance.post<ApiResponse<Submission>>('/submissions', input);
    return response.data;
  },
};
