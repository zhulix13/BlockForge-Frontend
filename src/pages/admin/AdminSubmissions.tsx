import { useState } from "react";
import {
  Inbox,
  User,
  Calendar,
  Eye,
  Layers,
  Activity,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import { useGetPendingSubmissions } from "../../api/hooks/submission.hooks";
import { useGetAdminTasks } from "../../api/hooks/task.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type ViewMode = "ACTIVITY" | "BY_TASK";
type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function AdminSubmissions() {
  const [viewMode, setViewMode] = useState<ViewMode>("ACTIVITY");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus>("PENDING");

  const { data: submissionData, isLoading: isLoadingSubs } =
    useGetPendingSubmissions({
      status: statusFilter === "ALL" ? undefined : statusFilter,
    });

  const { data: tasksData, isLoading: isLoadingTasks } = useGetAdminTasks();

  const submissions = submissionData?.data?.data ?? [];
  const tasks = tasksData?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageMetadata 
        title="Submissions Review" 
        description="Review and approve task proof submissions from hunters across the platform." 
      />
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Submission Management
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor and review hunter proof submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <button
            onClick={() => setViewMode("ACTIVITY")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              viewMode === "ACTIVITY"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <Activity size={16} />
            Recent Activity
          </button>
          <button
            onClick={() => setViewMode("BY_TASK")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              viewMode === "BY_TASK"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            <Layers size={16} />
            By Task
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 text-zinc-500">
          <Filter size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Filter:
          </span>
        </div>
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
              statusFilter === status
                ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600",
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden border border-zinc-800/50">
        {viewMode === "ACTIVITY" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Hunter
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Task
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {isLoadingSubs ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-48" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-5 w-16" />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Inbox
                        size={40}
                        className="mx-auto text-zinc-700 mb-3 opacity-20"
                      />
                      <p className="text-sm text-zinc-500">
                        No submissions found for this filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                            {sub.user?.profileImage ? (
                              <img
                                src={sub.user.profileImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={14} className="text-zinc-500" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-zinc-200 truncate">
                              {sub.user?.displayName || sub.user?.username}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-600 truncate">
                              @{sub.user?.username}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-300 group-hover:text-amber-400 transition-colors">
                            {sub.task?.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={sub.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-zinc-700" />
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/submissions/${sub.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors text-xs font-medium"
                        >
                          <Eye size={14} />
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-800/30">
            {isLoadingTasks ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-6 space-y-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : tasks.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-zinc-500">No tasks created yet.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/admin/tasks/${task.id}/submissions`}
                  className="p-6 hover:bg-white/[0.02] transition-colors group space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors leading-tight line-clamp-2">
                      {task.title}
                    </h3>
                    <StatusBadge status={task.status} />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        Submissions
                      </p>
                      <p className="text-lg font-mono font-bold text-zinc-300">
                        {task.completedCount}/{task.maxCompletions}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest pt-2">
                    View Submissions <ChevronRight size={12} />
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
