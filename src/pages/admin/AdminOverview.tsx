import { Users, FileText, Inbox, Wallet, TrendingUp, Clock, AlertCircle, Zap } from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { StatCardSkeleton, Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useGetPlatformStats } from "../../api/hooks/admin.hooks";
import { useGetPendingSubmissions } from "../../api/hooks/submission.hooks";
import { Link } from "react-router-dom";

// Simple bar chart component (no library dependency)
function MiniBarChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((value, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-sm bg-amber-500/20 hover:bg-amber-500/40 transition-colors relative group"
            style={{ height: `${(value / max) * 100}%`, minHeight: 4 }}
          >
            {/* Tooltip */}
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function AdminOverview() {
  const { data: statsRes, isLoading: statsLoading, isError } = useGetPlatformStats();
  const { data: reviewsRes, isLoading: reviewsLoading } = useGetPendingSubmissions({ limit: 5 });
  
  const stats = statsRes?.data;
  const reviews = reviewsRes?.data?.data ?? [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PageMetadata title="Admin Dashboard" />
        <AlertCircle size={40} className="text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-zinc-200">Failed to load platform stats</h3>
        <p className="text-sm text-zinc-500 mt-1">Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMetadata 
        title="Admin Dashboard" 
        description="Monitor platform performance, manage tasks, and review submissions." 
      />
      {/* Page intro */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          Dashboard
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Platform health at a glance.
        </p>
      </div>

      {/* Stat cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            label="Total Users"
            value={stats?.totalUsers.toLocaleString() ?? "0"}
            icon={Users}
            accent="border-l-amber-500"
          />
          <StatCard
            label="Active Tasks"
            value={stats?.activeTasks ?? "0"}
            icon={FileText}
            accent="border-l-blue-500"
          />
          <StatCard
            label="Reviews"
            value={stats?.totalSubmissions ?? "0"}
            icon={Inbox}
            accent="border-l-violet-500"
          />
          <StatCard
            label="Total Paid"
            value={`$${Number(stats?.totalPaidUsdc ?? 0).toFixed(2)}`}
            icon={Wallet}
            accent="border-l-emerald-500"
          />
          <StatCard
            label="Pending Payouts"
            value={`$${Number(stats?.totalPendingUsdc ?? 0).toFixed(2)}`}
            icon={Clock}
            accent="border-l-zinc-500"
          />
        </div>
      )}

      {/* Charts + Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Chart card */}
        <div className="lg:col-span-3 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">
                Task Completions
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Last 14 days</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={14} />
              <span className="text-xs font-semibold tabular-nums">+18%</span>
            </div>
          </div>
          <MiniBarChart data={[12, 19, 8, 15, 22, 14, 28, 32, 18, 25, 21, 30, 27, 35]} />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-zinc-600 font-mono">Apr 10</span>
            <span className="text-[10px] text-zinc-600 font-mono">Apr 24</span>
          </div>
        </div>

        {/* Pending Reviews (Real Activity) */}
        <div className="lg:col-span-2 glass rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-violet-400" />
              <h3 className="text-sm font-semibold text-zinc-200">
                Review Queue
              </h3>
            </div>
            <Link to="/admin/submissions" className="text-[10px] font-bold uppercase text-blue-400 hover:text-blue-300 transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/40">
            {reviewsLoading ? (
               Array.from({ length: 3 }).map((_, i) => (
                 <div key={i} className="px-5 py-4"><Skeleton className="h-10 w-full" /></div>
               ))
            ) : reviews.length === 0 ? (
              <div className="px-5 py-12 text-center">
                 <Zap size={24} className="mx-auto text-zinc-800 mb-2" />
                 <p className="text-sm text-zinc-600 italic">Review queue is empty!</p>
              </div>
            ) : (
              reviews.map((item) => (
                <Link
                  key={item.id}
                  to={`/admin/submissions/${item.id}`}
                  className="px-5 py-3 block hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-300 truncate">
                        <span className="font-medium text-zinc-100">
                          @{item.user?.username}
                        </span>{" "}
                        submitted proof
                      </p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {item.task?.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={item.status} />
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
