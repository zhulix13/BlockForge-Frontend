import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  Calendar, 
  Eye, 
  Filter,
  Inbox,
  AlertCircle
} from "lucide-react";
import { useGetTaskSubmissions } from "../../api/hooks/submission.hooks";
import { useGetTask } from "../../api/hooks/task.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { cn } from "../../lib/cn";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED" | "ALL";

export default function AdminTaskSubmissions() {
  const { taskId } = useParams<{ taskId: string }>();
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus>("ALL");

  const { data: taskResponse, isLoading: isLoadingTask } = useGetTask(taskId!);
  const { data: submissionData, isLoading: isLoadingSubs } = useGetTaskSubmissions(taskId!, {
    status: statusFilter === "ALL" ? undefined : statusFilter
  });

  const task = taskResponse?.data;
  const submissions = submissionData?.data?.data ?? [];

  if (isLoadingTask) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-zinc-700 mb-4" />
        <h3 className="text-lg font-bold text-zinc-200">Task not found</h3>
        <Link to="/admin/submissions" className="text-amber-500 hover:underline mt-2">Back to Submissions</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/submissions"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
              {task.title}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">Viewing all submissions for this task.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Progress</span>
          <span className="text-sm font-mono font-bold text-amber-500">{task.completedCount}/{task.maxCompletions}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 py-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 text-zinc-500">
          <Filter size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">Filter:</span>
        </div>
        {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
              statusFilter === status 
                ? "bg-zinc-100 text-zinc-900 border-zinc-100" 
                : "bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden border border-zinc-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Hunter</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {isLoadingSubs ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Inbox size={40} className="mx-auto text-zinc-700 mb-3 opacity-20" />
                    <p className="text-sm text-zinc-500">No submissions found for this filter.</p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                          {sub.user?.profileImage ? (
                            <img src={sub.user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User size={14} className="text-zinc-500" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-zinc-200 truncate">
                            {sub.user?.displayName || sub.user?.username}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-600 truncate">@{sub.user?.username}</span>
                        </div>
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
      </div>
    </div>
  );
}
