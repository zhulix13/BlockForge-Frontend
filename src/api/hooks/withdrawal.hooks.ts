import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawalApi } from '../endpoints/withdrawal.api';

export const useGetMyWithdrawals = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['withdrawals', 'my', params],
    queryFn: () => withdrawalApi.getMyWithdrawals(params),
  });
};

export const useGetMyTransactions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['transactions', 'my', params],
    queryFn: () => withdrawalApi.getMyTransactions(params),
  });
};

export const useRequestWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (amount: number) => withdrawalApi.requestWithdrawal(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'my'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletAddress: string) => withdrawalApi.updateWallet(walletAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};

// Admin Hooks
export const useGetAdminWithdrawals = (params?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['withdrawals', 'admin', params],
    queryFn: () => withdrawalApi.getAdminWithdrawals(params),
  });
};

export const useCompleteWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hash }: { id: string, hash: string }) => 
      withdrawalApi.completeWithdrawal(id, hash),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals', 'admin'] });
    },
  });
};

export const useRejectWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => withdrawalApi.rejectWithdrawal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals', 'admin'] });
    },
  });
};
