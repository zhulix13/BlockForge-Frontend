import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../endpoints/admin.api';
import type { UpdateUserRoleInput, UpdateUserStatusInput } from '../types/admin.types';

export const useGetPlatformStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats()
  });
};

export const useGetAdminUsers = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.listUsers(params)
  });
};

export const useGetAdminUserDetail = (userId: string | null) => {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => adminApi.getUserById(userId!),
    enabled: !!userId
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateUserRoleInput }) => 
      adminApi.updateUserRole(userId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] });
    }
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateUserStatusInput }) => 
      adminApi.updateUserStatus(userId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] });
    }
  });
};
