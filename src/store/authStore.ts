import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role } from '../api/types/shared.types';

interface User {
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
  balanceUsdc: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user, 
          isLoading: false 
        }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
    }),
    {
      name: 'bf-auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
