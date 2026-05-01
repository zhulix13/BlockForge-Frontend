import axiosInstance from "../axiosInstance";
import type { ApiResponse, PaginatedResponse } from "../types/shared.types";
import type { Withdrawal, Transaction } from "../types/withdrawal.types";

export const withdrawalApi = {
  getMyWithdrawals: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Withdrawal>>
    >("/withdrawals/my", { params });
    return response.data;
  },

  requestWithdrawal: async (amount: number) => {
    const response = await axiosInstance.post<ApiResponse<Withdrawal>>(
      "/withdrawals",
      { amount },
    );
    return response.data;
  },

  getMyTransactions: async (params?: { page?: number; limit?: number }) => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      "/user/transactions",
      { params },
    );
    return response.data;
  },

  updateWallet: async (walletAddress: string) => {
    const response = await axiosInstance.patch<ApiResponse<void>>(
      "/user/wallet",
      { walletAddress },
    );
    return response.data;
  },

  // Admin Endpoints
  getAdminWithdrawals: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Withdrawal>>
    >("/withdrawals/admin", { params });
    return response.data;
  },

  completeWithdrawal: async (withdrawalId: string, transactionHash: string) => {
    const response = await axiosInstance.post<ApiResponse<Withdrawal>>(
      `/withdrawals/admin/${withdrawalId}/complete`,
      { transactionHash },
    );
    return response.data;
  },

  rejectWithdrawal: async (withdrawalId: string) => {
    const response = await axiosInstance.post<ApiResponse<Withdrawal>>(
      `/withdrawals/admin/${withdrawalId}/reject`,
    );
    return response.data;
  },
};
