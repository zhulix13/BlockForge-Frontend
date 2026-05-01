import { useState } from "react";
import { FileText, Plus, Users, Zap, Star, ShieldAlert, Eye } from "lucide-react";
import { CreateTaskModal } from "../../components/admin/CreateTaskModal";
import { useGetAdminTasks } from "../../api/hooks/task.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function AdminTasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tasksData, isLoading } = useGetAdminTasks();

  const tasks = tasksData?.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageMetadata 
        title="Task Management" 
        description="Create and manage tasks for hunters to forge and earn rewards." 
      />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Task Management
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Create, manage, and monitor all platform tasks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm rounded-lg transition-colors active:scale-95 shadow-lg shadow-amber-500/20"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="glass rounded-xl overflow-hidden border border-zinc-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/50 bg-zinc-900/30">
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Task</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Level</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Reward</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Progress</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <FileText size={40} className="mx-auto text-zinc-700 mb-3 opacity-20" />
                    <p className="text-sm text-zinc-500">No tasks forged yet.</p>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const progress = Math.round((task.completedCount / task.maxCompletions) * 100);
                  return (
                    <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-200 group-hover:text-amber-400 transition-colors">{task.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border",
                          task.level === "EASY" && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                          task.level === "MEDIUM" && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                          task.level === "HARD" && "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {task.level === "EASY" ? <Zap size={10} /> : <Star size={10} />}
                          {task.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-zinc-300">${task.rewardUsdc}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 w-32">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500 flex items-center gap-1"><Users size={10} />{task.completedCount}/{task.maxCompletions}</span>
                            <span className="text-zinc-500 tabular-nums">{progress}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full bg-amber-500/50 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <StatusBadge status={task.status} />
                          <Link 
                            to={`/admin/tasks/${task.id}`}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-500 hover:bg-zinc-700 transition-all"
                            title="Manage Task"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
