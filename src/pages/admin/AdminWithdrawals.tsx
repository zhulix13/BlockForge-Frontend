import { useState } from "react";
import { Wallet, CheckCircle2, XCircle, Search, ArrowRight, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { 
  useGetAdminWithdrawals, 
  useCompleteWithdrawal, 
  useRejectWithdrawal 
} from "../../api/hooks/withdrawal.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Modal } from "../../components/ui/Modal";
import { cn } from "../../lib/cn";
import { useToast } from "../../store/toastStore";
import { PageMetadata } from "../../components/ui/PageMetadata";

export default function AdminWithdrawals() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETED" | "REJECTED">("PENDING");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [txHash, setTxHash] = useState("");

  const { data: response, isLoading } = useGetAdminWithdrawals({ status: activeTab });
  const withdrawals = response?.data?.data ?? [];

  const completeMutation = useCompleteWithdrawal();
  const rejectMutation = useRejectWithdrawal();

  const handleComplete = async () => {
    if (!txHash.trim()) {
      toast.error("Transaction hash is required to complete payout.");
      return;
    }

    try {
      await completeMutation.mutateAsync({ id: selectedWithdrawal.id, hash: txHash });
      toast.success("Withdrawal marked as completed!");
      setSelectedWithdrawal(null);
      setTxHash("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete withdrawal");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this withdrawal? Funds will be returned to the hunter.")) return;

    try {
      await rejectMutation.mutateAsync(id);
      toast.success("Withdrawal rejected.");
      if (selectedWithdrawal?.id === id) setSelectedWithdrawal(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject withdrawal");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMetadata 
        title="Withdrawal Requests" 
        description="Process and monitor payout requests from hunters. Ensure on-chain signatures are recorded for transparency." 
      />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">Withdrawal Processing</h2>
          <p className="text-sm text-zinc-500 mt-1">Review and complete pending USDC payouts.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/50 border border-zinc-800">
          {(["PENDING", "COMPLETED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                activeTab === tab 
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-zinc-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/30 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-4">Hunter</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Wallet Address</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                      <Search size={20} className="text-zinc-700" />
                    </div>
                    <p className="text-sm text-zinc-500 font-medium">No {activeTab.toLowerCase()} withdrawals found.</p>
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-200">{w.user?.displayName || w.user?.username}</span>
                        <span className="text-[10px] font-mono text-zinc-600 mt-0.5">@{w.user?.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black tabular-nums text-amber-500">${Number(w.amountUsdc).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <code className="text-xs font-mono text-zinc-400 truncate">{w.walletAddress}</code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(w.walletAddress);
                            toast.success("Wallet address copied!");
                          }}
                          className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors shrink-0"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-zinc-500">{new Date(w.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {w.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedWithdrawal(w)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-black font-bold text-[10px] uppercase transition-all"
                          >
                            <CheckCircle2 size={12} />
                            Complete
                          </button>
                          <button 
                            onClick={() => handleReject(w.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Reject Withdrawal"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-3">
                          <StatusBadge status={w.status} />
                          {w.transactionHash && (
                            <a 
                              href={`https://explorer.solana.com/tx/${w.transactionHash}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-amber-400 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completion Modal */}
      <Modal 
        open={!!selectedWithdrawal} 
        onClose={() => {
          setSelectedWithdrawal(null);
          setTxHash("");
        }} 
        title="Complete Payout"
      >
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertCircle size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Admin Instruction</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Before completing this request, please send <span className="text-amber-500 font-black">${Number(selectedWithdrawal?.amountUsdc).toFixed(2)} USDC</span> to the hunter's Solana wallet.
            </p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-zinc-800">
              <code className="flex-1 text-[10px] font-mono text-zinc-300 truncate">{selectedWithdrawal?.walletAddress}</code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedWithdrawal?.walletAddress);
                  toast.success("Wallet address copied!");
                }}
                className="p-1 text-zinc-500 hover:text-zinc-200"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">On-chain Transaction Hash</label>
            <input 
              type="text" 
              placeholder="Enter Solana transaction hash (Signature)" 
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 transition-colors"
            />
            <p className="text-[10px] text-zinc-600 italic">This hash will be shared with the hunter for verification.</p>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button 
              onClick={() => setSelectedWithdrawal(null)} 
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={!txHash.trim() || completeMutation.isPending}
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/30 disabled:text-zinc-500 text-black font-bold text-sm shadow-lg shadow-amber-500/10 transition-all"
            >
              {completeMutation.isPending ? "Processing..." : "Mark as Completed"}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
