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
  balance: {
    available: number;
    pending: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}
