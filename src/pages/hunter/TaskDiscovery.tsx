import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Users,
  Zap,
  Star,
  Filter,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { useGetTasks } from "../../api/hooks/task.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import type { TaskLevel } from "../../api/types/shared.types";

const levels = ["ALL", "EASY", "MEDIUM", "HARD"] as const;
const levelColors: Record<string, string> = {
  EASY: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  MEDIUM: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  HARD: "bg-red-500/10 text-red-400 ring-red-500/20",
};

const sortOptions = [
  { label: "Newest", value: "createdAt", order: "desc" },
  { label: "Reward: High to Low", value: "rewardUsdc", order: "desc" },
  { label: "Reward: Low to High", value: "rewardUsdc", order: "asc" },
] as const;

const statusOptions = [
  { label: "All Tasks", value: "ALL" },
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "APPROVED" },
] as const;

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function TaskDiscovery() {
  const [activeLevel, setActiveLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [activeSort, setActiveSort] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: tasksData, isLoading } = useGetTasks({
    level: activeLevel === "ALL" ? undefined : (activeLevel as TaskLevel),
    search: debouncedSearch || undefined,
    userStatus: activeStatus === "ALL" ? undefined : activeStatus,
    sortBy: sortOptions[activeSort].value,
    sortOrder: sortOptions[activeSort].order as any,
  });

  const tasks = tasksData?.data?.data ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageMetadata 
        title="Find Tasks" 
        description="Discover new tasks and start earning USDC rewards today." 
      />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 tracking-tight">
            Browse Tasks
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Discover tasks, complete them, and earn USDC rewards.
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/50 border border-stone-800 text-sm text-stone-200 placeholder:text-stone-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900/30 border border-stone-800 text-stone-600">
            <Filter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Filter
            </span>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/50 border border-stone-800 overflow-x-auto scrollbar-none max-w-full">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={cn(
                  "px-2 sm:px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap",
                  activeLevel === level
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-stone-500 hover:text-stone-300",
                )}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/50 border border-stone-800 overflow-x-auto scrollbar-none max-w-full">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveStatus(opt.value)}
                className={cn(
                  "px-2 sm:px-3 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap",
                  activeStatus === opt.value
                    ? "bg-stone-100 text-black shadow-lg"
                    : "text-stone-500 hover:text-stone-300",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Filter */}
          <div className="relative ml-auto">
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(parseInt(e.target.value))}
              className="appearance-none pl-10 pr-10 py-2 rounded-xl bg-stone-900/50 border border-stone-800 text-xs font-bold text-stone-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 hover:border-stone-700 transition-all cursor-pointer uppercase tracking-widest"
            >
              {sortOptions.map((opt, i) => (
                <option key={i} value={i}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass rounded-2xl px-5 py-24 text-center border-dashed border-stone-800 bg-transparent">
          <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-6 text-stone-700 border border-stone-800">
            <Search size={28} />
          </div>
          <h3 className="text-stone-200 font-bold text-lg">
            No tasks match your search
          </h3>
          <p className="text-sm text-stone-500 mt-2 max-w-xs mx-auto">
            Try adjusting your filters or search terms to find available tasks.
          </p>
          <button
            onClick={() => {
              setActiveLevel("ALL");
              setActiveStatus("ALL");
              setSearchQuery("");
            }}
            className="mt-6 text-blue-400 font-bold text-xs uppercase tracking-widest hover:text-blue-300 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {tasks.map((task) => {
            const progress = Math.round(
              (task.completedCount / task.maxCompletions) * 100,
            );
            return (
              <Link
                key={task.id}
                to={`/hunter/tasks/${task.id}`}
                className="glass group relative overflow-hidden rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                {/* Visual indicator for new tasks (less than 24h old) */}
                {new Date().getTime() - new Date(task.createdAt).getTime() <
                  86400000 && (
                  <div className="absolute -right-8 -top-8 w-16 h-16 bg-blue-500/10 rotate-45 group-hover:bg-blue-500/20 transition-colors" />
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ring-1 ring-inset",
                          levelColors[task.level],
                        )}
                      >
                        {task.level}
                      </span>
                      {new Date().getTime() -
                        new Date(task.createdAt).getTime() <
                        86400000 && (
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                          <Clock size={8} /> New
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-stone-100 group-hover:text-blue-400 transition-colors truncate">
                      {task.title}
                    </h3>
                  </div>

                  {task.userSubmissionStatus && (
                    <div
                      className={cn(
                        "shrink-0 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border",
                        task.userSubmissionStatus === "PENDING" &&
                          "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        task.userSubmissionStatus === "APPROVED" &&
                          "bg-emerald-500 text-black border-emerald-500",
                        task.userSubmissionStatus === "REJECTED" &&
                          "bg-red-500/10 text-red-500 border-red-500/20",
                      )}
                    >
                      {task.userSubmissionStatus === "APPROVED"
                        ? "Completed"
                        : task.userSubmissionStatus}
                    </div>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tabular-nums text-stone-100 tracking-tight">
                    ${task.rewardUsdc}
                  </span>
                  <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">
                    USDC Reward
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-stone-500 flex items-center gap-1.5">
                      <Users size={12} className="text-stone-700" />{" "}
                      {task.completedCount}/{task.maxCompletions} forged
                    </span>
                    <span
                      className={cn(
                        "tabular-nums",
                        progress > 80 ? "text-amber-500" : "text-stone-500",
                      )}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-900 border border-stone-800 overflow-hidden p-0.5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        progress > 90 ? "bg-amber-500" : "bg-blue-500",
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-800/50">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-stone-950 bg-stone-800 flex items-center justify-center"
                        >
                          <Zap size={8} className="text-stone-500" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-tighter">
                      {task._count?.steps || 0} step
                      {(task._count?.steps || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:text-blue-300 transition-colors">
                    Forge Now{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
