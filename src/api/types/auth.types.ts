import type { Role } from './shared.types';

export interface AuthMeResponse {
  id: string;
  role: Role;
  isActive: boolean;
  xId: string;
  username: string;
  displayName?: string;
  profileImage?: string;
  walletAddress?: string;
  availableBalanceUsdc: string;
  pendingBalanceUsdc: string;
  outgoingBalanceUsdc: string;
  balanceUsdc: string; // Now Total Earnings
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}
