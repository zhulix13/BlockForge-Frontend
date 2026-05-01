import type { WithdrawalStatus, TransactionType } from './shared.types';

export interface Withdrawal {
  id: string;
  userId: string;
  amountMicrounits: number;
  amountUsdc: number;
  status: WithdrawalStatus;
  walletAddress: string;
  transactionHash?: string;
  createdAt: string;
  user?: {
    username: string;
    displayName?: string;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: string | number;
  description: string;
  createdAt: string;
}
