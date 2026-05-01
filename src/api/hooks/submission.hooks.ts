import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionApi } from '../endpoints/submission.api';
import type { CreateSubmissionInput, UploadUrlInput } from '../types/submission.types';

export const useGetMySubmissions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['submissions', 'my', params],
    queryFn: () => submissionApi.getMySubmissions(params),
  });
};

export const useGetMySubmissionDetails = (submissionId: string) => {
  return useQuery({
    queryKey: ['submissions', 'my', 'detail', submissionId],
    queryFn: () => submissionApi.getMySubmissionById(submissionId),
    enabled: !!submissionId,
  });
};

export const useGetUploadUrl = () => {
  return useMutation({
    mutationFn: (input: UploadUrlInput) => submissionApi.getUploadUrl(input),
  });
};

export const useGetPendingSubmissions = (params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['submissions', 'pending', params],
    queryFn: () => submissionApi.getPendingSubmissions(params),
  });
};

export const useGetSubmissionDetails = (submissionId: string) => {
  return useQuery({
    queryKey: ['submissions', 'detail', submissionId],
    queryFn: () => submissionApi.getSubmissionById(submissionId),
    enabled: !!submissionId,
  });
};

export const useGetTaskSubmissions = (taskId: string, params?: { page?: number; limit?: number; status?: string }) => {
  return useQuery({
    queryKey: ['submissions', 'task', taskId, params],
    queryFn: () => submissionApi.getTaskSubmissions(taskId, params),
    enabled: !!taskId,
  });
};

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, input }: { submissionId: string; input: ReviewSubmissionInput }) => 
      submissionApi.reviewSubmission(submissionId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submissions', 'detail', variables.submissionId] });
    },
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubmissionInput) => submissionApi.createSubmission(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};
