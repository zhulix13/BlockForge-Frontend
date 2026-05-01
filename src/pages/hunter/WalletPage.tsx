import { useState, useEffect } from "react";
import {
  Wallet,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  ExternalLink,
  Search,
} from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/authStore";
import {
  useGetMyWithdrawals,
  useGetMyTransactions,
  useRequestWithdrawal,
  useUpdateWallet,
} from "../../api/hooks/withdrawal.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../store/toastStore";
import { TrendingUp } from "lucide-react";

const MIN_WITHDRAWAL = 0.2;

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function WalletPage() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [walletInput, setWalletInput] = useState(user?.walletAddress || "");
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { data: withdrawalsRes, isLoading: loadingWithdrawals } =
    useGetMyWithdrawals();
  const { data: transactionsRes, isLoading: loadingTransactions } =
    useGetMyTransactions();

  const updateWalletMutation = useUpdateWallet();
  const requestWithdrawalMutation = useRequestWithdrawal();

  useEffect(() => {
    if (user?.walletAddress) {
      setWalletInput(user.walletAddress);
    }
  }, [user?.walletAddress]);

  const handleCopyWallet = () => {
    if (!user?.walletAddress) return;
    navigator.clipboard.writeText(user.walletAddress);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
    toast.success("Transaction hash copied!");
  };

  const handleUpdateWallet = async () => {
    try {
      await updateWalletMutation.mutateAsync(walletInput);
      setWalletModalOpen(false);
      toast.success("Wallet address updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update wallet");
    }
  };

  const handleRequestWithdrawal = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is $${MIN_WITHDRAWAL} USDC`);
      return;
    }

    try {
      await requestWithdrawalMutation.mutateAsync(amount);
      setWithdrawAmount("");
      setConfirmModalOpen(false);
      toast.success("Withdrawal request submitted!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to request withdrawal",
      );
    }
  };

  const withdrawals = withdrawalsRes?.data?.data ?? [];
  const transactions = transactionsRes?.data ?? []; // Fixed: data is directly the array
  const availableBalance = Number(user?.availableBalanceUsdc ?? 0);
  const totalEarnings = Number(user?.balanceUsdc ?? 0);
  const isWithdrawDisabled =
    !withdrawAmount ||
    parseFloat(withdrawAmount) < MIN_WITHDRAWAL ||
    parseFloat(withdrawAmount) > availableBalance ||
    requestWithdrawalMutation.isPending;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMetadata 
        title="Wallet" 
        description="Manage your USDC balance, connect your FluxaPay wallet, and request payouts." 
      />
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
          Wallet & Withdrawals
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Manage your FluxaPay wallet and request payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Earnings */}
        <div className="glass rounded-xl p-5 sm:p-6 space-y-4 border-l-[3px] border-l-blue-500">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp size={18} className="text-blue-400" />
            </div>
            <h3 className="text-sm font-semibold text-stone-200">
              Total Earnings
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-stone-50">
              ${totalEarnings.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-stone-500 uppercase">
              all-time
            </span>
          </div>
        </div>

        {/* Wallet card */}
        <div className="glass rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Wallet size={18} className="text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-stone-200">
              FluxaPay Wallet
            </h3>
          </div>

          {user?.walletAddress ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-800/50 border border-stone-700/30">
                <code className="flex-1 text-xs font-mono text-stone-300 truncate">
                  {user.walletAddress}
                </code>
                <button
                  onClick={handleCopyWallet}
                  className="p-1.5 rounded-md text-stone-500 hover:text-stone-300 hover:bg-stone-700/50 transition-colors shrink-0"
                >
                  {copiedWallet ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
              <button
                onClick={() => setWalletModalOpen(true)}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Update wallet address
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-stone-500 mb-3">
                No FluxaPay wallet connected
              </p>
              <button
                onClick={() => setWalletModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Withdrawal card */}
        <div className="glass rounded-xl p-5 sm:p-6 space-y-4 border-l-[3px] border-l-emerald-500">
          <h3 className="text-sm font-semibold text-stone-200">
            Request Withdrawal
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-emerald-400">
              ${availableBalance.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-stone-500 uppercase">
              available
            </span>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full pl-7 pr-16 py-2.5 rounded-lg bg-stone-800/50 border border-stone-700/50 text-sm text-stone-200 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors tabular-nums"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-600 uppercase">
                USDC
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-600">
              <AlertCircle size={12} />
              <span>Minimum withdrawal: ${MIN_WITHDRAWAL} USDC</span>
            </div>
          </div>
          <button
            disabled={isWithdrawDisabled}
            onClick={() => setConfirmModalOpen(true)}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-blue-200/30 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Withdrawal history */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-800/50">
          <h3 className="text-sm font-semibold text-stone-200">
            Withdrawal History
          </h3>
        </div>
        <div className="divide-y divide-stone-800/40">
          {loadingWithdrawals ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="px-5 py-4">
                <Skeleton className="h-10 w-full" />
              </div>
            ))
          ) : withdrawals.length === 0 ? (
            <div className="px-5 py-10 text-center text-stone-600 italic text-sm">
              No withdrawals yet.
            </div>
          ) : (
            withdrawals.map((w) => (
              <div
                key={w.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold tabular-nums text-stone-200">
                      ${Number(w.amountUsdc).toFixed(2)} USDC
                    </p>
                    <StatusBadge status={w.status} />
                  </div>
                  <p className="text-[10px] text-stone-600">
                    {new Date(w.createdAt).toLocaleString()}
                  </p>
                </div>

                {w.transactionHash && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900/50 border border-stone-800 shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-stone-600 tracking-tighter leading-none mb-1">
                        On-chain Hash
                      </span>
                      <code className="text-[10px] font-mono text-blue-400/80 truncate max-w-[120px] sm:max-w-[200px]">
                        {w.transactionHash}
                      </code>
                    </div>
                    <div className="flex items-center gap-1 ml-2 border-l border-stone-800 pl-2">
                      <button
                        onClick={() => handleCopyHash(w.transactionHash!)}
                        className="p-1 text-stone-500 hover:text-blue-400 transition-colors"
                      >
                        {copiedHash === w.transactionHash ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                      <a
                        href={`https://etherscan.io/tx/${w.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-stone-500 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction ledger */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-800/50">
          <h3 className="text-sm font-semibold text-stone-200">
            Transaction History
          </h3>
        </div>
        <div className="divide-y divide-stone-800/40">
          {loadingTransactions ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-3 border border-stone-800">
                <Search size={16} className="text-stone-700" />
              </div>
              <p className="text-sm text-stone-500 italic">
                No transactions recorded yet.
              </p>
            </div>
          ) : (
            transactions.map((tx) => {
              const isPositive = Number(tx.amount) > 0;
              return (
                <div
                  key={tx.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                    >
                      {isPositive ? (
                        <ArrowDownLeft size={16} />
                      ) : (
                        <ArrowUpRight size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-stone-300 leading-tight">
                        {tx.description ||
                          (isPositive ? "Reward" : "Withdrawal")}
                      </p>
                      <p className="text-[10px] text-stone-600 mt-1">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-black tabular-nums ${isPositive ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {isPositive ? "+" : ""}$
                    {Math.abs(Number(tx.amount)).toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Wallet modal */}
      <Modal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        title="Update FluxaPay Wallet"
      >
        <div className="space-y-4">
          <p className="text-sm text-stone-400">
            Enter your FluxaPay wallet address for receiving USDC payouts.
          </p>
          <input
            type="text"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            placeholder="FluxaPay wallet address"
            className="w-full px-4 py-2.5 rounded-lg bg-stone-800/50 border border-stone-700/50 text-sm text-stone-200 font-mono placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-colors"
          />
          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => setWalletModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!walletInput || updateWalletMutation.isPending}
              onClick={handleUpdateWallet}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/30 disabled:text-blue-200/30 text-white text-sm font-semibold transition-colors"
            >
              {updateWalletMutation.isPending ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Withdrawal"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-800/50">
              <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">
                Amount
              </span>
              <span className="text-lg font-black text-white">
                ${Number(withdrawAmount).toFixed(2)} USDC
              </span>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">
                Recipient Wallet (FluxaPay)
              </span>
              <div className="p-2.5 rounded-lg bg-black/40 border border-stone-800/50">
                <code className="text-xs font-mono text-blue-400/90 break-all">
                  {user?.walletAddress}
                </code>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Please double-check the wallet address. Payouts are irreversible
              once processed on-chain.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRequestWithdrawal}
              disabled={requestWithdrawalMutation.isPending}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
            >
              {requestWithdrawalMutation.isPending
                ? "Processing..."
                : "Confirm & Send"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
