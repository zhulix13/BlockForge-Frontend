import axiosInstance from '../axiosInstance';
import type { AuthMeResponse } from '../types/auth.types';
import type { ApiResponse } from '../types/shared.types';

export const authApi = {
  getMe: async () => {
    const response = await axiosInstance.get<ApiResponse<AuthMeResponse>>('/user/profile');
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  // OAuth initiation via full redirect
  initiateXLogin: () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/x`;
  },

  handleXCallback: async (code: string, state: string) => {
    const response = await axiosInstance.get<ApiResponse<void>>(`/auth/x/callback`, {
      params: { code, state }
    });
    return response.data;
  },
};
