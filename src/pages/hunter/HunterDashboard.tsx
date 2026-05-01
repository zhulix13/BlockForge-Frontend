import {
  Wallet,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Zap,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/authStore";
import { useGetMySubmissions } from "../../api/hooks/submission.hooks";
import { StatCardSkeleton, Skeleton } from "../../components/ui/Skeleton";
import { PageMetadata } from "../../components/ui/PageMetadata";

export default function HunterDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetMySubmissions({ limit: 5 });

  const balances = {
    available: Number(user?.availableBalanceUsdc ?? 0),
    pending: Number(user?.pendingBalanceUsdc ?? 0),
    outgoing: Number(user?.outgoingBalanceUsdc ?? 0),
    totalEarned: Number(user?.balanceUsdc ?? 0),
  };

  const recentSubmissions = submissionsData?.data?.data ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMetadata
        title="Hunter Dashboard"
        description="Monitor your earnings, recent tasks, and activity on BlockForge."
      />
      {/* Page intro */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
          Dashboard
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Your earnings and activity at a glance.
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass rounded-xl border-l-[3px] border-l-emerald-500 p-4 sm:p-5 transition-all duration-200 hover:bg-white/[0.04] group">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                Available Balance
              </p>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums text-stone-50 tracking-tight">
                ${balances.available.toFixed(2)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/15 transition-colors">
              <Wallet size={20} className="text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-800/60">
            <span className="text-xs text-stone-500">Ready to withdraw</span>
          </div>
        </div>

        <div className="glass rounded-xl border-l-[3px] border-l-amber-500 p-4 sm:p-5 transition-all duration-200 hover:bg-white/[0.04] group">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                Pending Balance
              </p>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums text-stone-50 tracking-tight">
                ${balances.pending.toFixed(2)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 group-hover:bg-amber-500/15 transition-colors">
              <Clock size={20} className="text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-800/60">
            <span className="text-xs text-stone-500">Awaiting review</span>
          </div>
        </div>

        <div className="glass rounded-xl border-l-[3px] border-l-red-500 p-4 sm:p-5 transition-all duration-200 hover:bg-white/[0.04] group">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-stone-500">
                Outgoing
              </p>
              <p className="text-2xl sm:text-3xl font-bold tabular-nums text-stone-50 tracking-tight">
                ${balances.outgoing.toFixed(2)}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/15 transition-colors">
              <ArrowUpRight size={20} className="text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-stone-800/60">
            <span className="text-xs text-stone-500">
              Processing withdrawals
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <StatCard
          label="Total Earnings"
          value={`$${balances.totalEarned.toFixed(2)}`}
          icon={CheckCircle2}
          accent="border-l-blue-500"
        />
      </div>

      {/* Charts + Recent Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Earnings chart placeholder */}
        <div className="lg:col-span-3 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-stone-200">
                Earnings Overview
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Last 14 days</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={14} />
              <span className="text-xs font-semibold tabular-nums">+15%</span>
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-20">
            {[8, 12, 5, 15, 10, 18, 22, 14, 20, 16, 25, 12, 28, 30].map(
              (value, i) => {
                const max = 30;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-sm bg-blue-500/20 hover:bg-blue-500/40 transition-colors relative group"
                      style={{
                        height: `${(value / max) * 100}%`,
                        minHeight: 4,
                      }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${value}
                      </span>
                    </div>
                  </div>
                );
              },
            )}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-stone-600 font-mono">Apr 10</span>
            <span className="text-[10px] text-stone-600 font-mono">Apr 24</span>
          </div>
        </div>

        {/* Recent submissions */}
        <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-800/50">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-stone-200">
                Recent Submissions
              </h3>
            </div>
          </div>
          <div className="divide-y divide-stone-800/40">
            {submissionsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="px-5 py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))
            ) : recentSubmissions.length === 0 ? (
              <div className="px-5 py-8 text-center text-stone-500 text-sm">
                No submissions yet.
              </div>
            ) : (
              recentSubmissions.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-stone-300 truncate font-medium">
                        {item.task?.title || "Unknown Task"}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-1 tabular-nums">
                        Forged on{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={item.status} />
                      <span className="text-[9px] font-mono text-stone-600 uppercase tracking-tighter mt-1">
                        ${item.task?.rewardUsdc} USDC
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
