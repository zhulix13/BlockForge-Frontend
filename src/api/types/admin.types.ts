import { Role, TransactionType } from './shared.types';

export interface PlatformStats {
  totalUsers: number;
  activeTasks: number;
  totalTasks: number;
  totalSubmissions: number;
  totalPaidUsdc: string;
  totalPendingUsdc: string;
}

export interface AdminUser {
  id: string;
  username: string;
  displayName: string | null;
  profileImage: string | null;
  walletAddress: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  _count: {
    submissions: number;
    withdrawals: number;
  };
}

export interface AdminTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: string; // Microunits as string from backend usually, but service maps to amountUsdc
  amountUsdc: string;
  referenceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDetail extends AdminUser {
  xId: string;
  updatedAt: string;
  transactions: AdminTransaction[];
  balanceUsdc: string; // Total Earnings
}

export interface UpdateUserRoleInput {
  role: Role;
}

export interface UpdateUserStatusInput {
  isActive: boolean;
}
