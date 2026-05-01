import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../lib/cn";
import { useGetTask } from "../../api/hooks/task.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { TaskSubmissionFlow } from "../../components/hunter/TaskSubmissionFlow";

/* ─── Constants ─── */

const levelColors: Record<string, string> = {
  EASY: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  HARD: "bg-red-500/10 text-red-400 ring-red-500/20",
};

/* ─── Component ─── */

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function TaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: taskResponse, isLoading } = useGetTask(taskId ?? "");

  const task = taskResponse?.data;
  const progress = task
    ? Math.round((task.completedCount / task.maxCompletions) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <div className="glass rounded-xl p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-16 w-full" />
          <div className="flex gap-4 pt-4 border-t border-stone-800/50">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500">Task not found.</p>
        <Link
          to="/hunter/tasks"
          className="text-blue-400 hover:underline mt-2 inline-block"
        >
          Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl">
      <PageMetadata 
        title={task ? `${task.title} - Details` : "Task Details"} 
        description={task?.description || "View task requirements and submit your proof for USDC rewards."} 
      />
      {/* Back link */}
      <Link
        to="/hunter/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-blue-400 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to tasks
      </Link>

      {/* Task header */}
      <div className="glass rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-stone-100 tracking-tight">
              {task.title}
            </h2>
            <p className="text-sm text-stone-400 leading-relaxed">
              {task.description}
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md ring-1 ring-inset shrink-0",
              levelColors[task.level],
            )}
          >
            {task.level}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-stone-800/50">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider">
              Reward
            </p>
            <p className="text-lg font-bold tabular-nums text-stone-50">
              ${task.rewardUsdc}{" "}
              <span className="text-xs font-mono text-stone-500">USDC</span>
            </p>
          </div>
          <div className="w-px h-8 bg-stone-800" />
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider">
              Completions
            </p>
            <p className="text-sm font-semibold tabular-nums text-stone-200">
              {task.completedCount} / {task.maxCompletions}
            </p>
          </div>
          <div className="w-px h-8 bg-stone-800" />
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider">
              Progress
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 h-1.5 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs tabular-nums text-stone-400">
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Flow (Steps + Proofs) */}
      {task.userSubmissionStatus && task.userSubmissionStatus !== "REJECTED" ? (
        <div className="glass rounded-xl p-8 text-center space-y-4">
          <div className={cn(
            "w-12 h-12 rounded-full mx-auto flex items-center justify-center",
            task.userSubmissionStatus === "APPROVED" ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
          )}>
            <div className="w-6 h-6 rounded-full border-2 border-current" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-100">
              {task.userSubmissionStatus === "APPROVED" ? "Task Completed!" : "Submission Pending"}
            </h3>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              {task.userSubmissionStatus === "APPROVED" 
                ? "You've successfully completed this task and earned your reward."
                : "Your proof has been submitted and is currently being reviewed by our team."}
            </p>
          </div>
          <Link 
            to="/hunter/submissions"
            className="inline-block px-6 py-2 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 transition-colors text-sm font-semibold"
          >
            View My Submissions
          </Link>
        </div>
      ) : (
        <TaskSubmissionFlow task={task} />
      )}
    </div>
  );
}
