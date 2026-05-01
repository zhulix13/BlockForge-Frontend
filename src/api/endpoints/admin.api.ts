import axiosInstance from '../axiosInstance';
import type { ApiResponse, PaginatedResponse } from '../types/shared.types';
import type { 
  PlatformStats, 
  AdminUser, 
  AdminUserDetail, 
  UpdateUserRoleInput, 
  UpdateUserStatusInput 
} from '../types/admin.types';

export const adminApi = {
  getStats: async () => {
    const response = await axiosInstance.get<ApiResponse<PlatformStats>>('/admin/stats');
    return response.data;
  },

  listUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<AdminUser>>>('/admin/users', { params });
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await axiosInstance.get<ApiResponse<AdminUserDetail>>(`/admin/users/${userId}`);
    return response.data;
  },

  updateUserRole: async (userId: string, input: UpdateUserRoleInput) => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>(`/admin/users/${userId}/role`, input);
    return response.data;
  },

  updateUserStatus: async (userId: string, input: UpdateUserStatusInput) => {
    const response = await axiosInstance.patch<ApiResponse<{ message: string }>>(`/admin/users/${userId}/status`, input);
    return response.data;
  }
};
