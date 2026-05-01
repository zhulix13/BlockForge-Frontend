import { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Eye,
  Filter,
} from "lucide-react";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useGetMySubmissions } from "../../api/hooks/submission.hooks";
import { useAuthStore } from "../../store/authStore";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../lib/cn";
import { SubmissionDetailModal } from "../../components/hunter/SubmissionDetailModal";

const statusFilters = [
  { label: "All", value: undefined },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function MySubmissions() {
  const user = useAuthStore((s) => s.user);
  const [activeStatus, setActiveStatus] = useState<string | undefined>(
    undefined,
  );
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);

  const { data: response, isLoading } = useGetMySubmissions({
    status: activeStatus,
    limit: 50, // Get a good chunk
  });

  const submissions = response?.data?.data ?? [];
  const totalCount = response?.data?.metadata?.total ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMetadata
        title="My Submissions"
        description="Track the status of your task proof submissions and earned rewards."
      />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
            My Submissions
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Track the status of your task proof submissions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/50 border border-stone-800">
          {statusFilters.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveStatus(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150",
                activeStatus === f.value
                  ? "bg-blue-600 text-white"
                  : "text-stone-500 hover:text-stone-300",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - Using user balance info as the primary indicators for now */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Forged"
          value={totalCount}
          icon={ClipboardCheck}
          accent="border-l-blue-500"
        />
        <StatCard
          label="Pending Rewards"
          value={`$${user?.pendingBalanceUsdc || "0.00"}`}
          icon={Clock}
          accent="border-l-amber-500"
        />
        <StatCard
          label="Approved Rewards"
          value={`$${user?.availableBalanceUsdc || "0.00"}`}
          icon={CheckCircle2}
          accent="border-l-emerald-500"
        />
        <StatCard
          label="Total Earnings"
          value={`$${Number(user?.balanceUsdc || 0).toFixed(2)}`}
          icon={CheckCircle2}
          accent="border-l-blue-500"
        />
      </div>

      {/* Submissions list */}
      <div className="glass rounded-xl overflow-hidden border border-stone-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800/50 bg-stone-900/30 text-[10px] font-black uppercase tracking-widest text-stone-500">
                <th className="px-6 py-4">Task</th>
                <th className="px-6 py-4">Reward</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/30">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-40" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4 border border-stone-800">
                      <Search size={20} className="text-stone-700" />
                    </div>
                    <p className="text-sm text-stone-500 font-medium">
                      No submissions found matching this filter.
                    </p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedSubmissionId(sub.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-stone-200 group-hover:text-blue-400 transition-colors">
                          {sub.task?.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-black tabular-nums text-stone-300">
                          ${sub.task?.rewardUsdc}
                        </span>
                        <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">
                          USDC
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-stone-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <StatusBadge status={sub.status} />
                        <button className="p-1.5 rounded-lg bg-stone-900 text-stone-500 group-hover:text-blue-400 transition-colors">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SubmissionDetailModal
        isOpen={!!selectedSubmissionId}
        onClose={() => setSelectedSubmissionId(null)}
        submissionId={selectedSubmissionId || ""}
      />
    </div>
  );
}
