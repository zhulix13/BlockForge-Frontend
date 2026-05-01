import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Users, 
  Zap, 
  Star,
  Settings,
  Activity,
  DollarSign
} from "lucide-react";
import { useGetAdminTask, useUpdateTask } from "../../api/hooks/task.hooks";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../store/toastStore";
import { getFriendlyErrorMessage } from "../../lib/error.utils";
import { cn } from "../../lib/cn";

export default function AdminTaskDetail() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { data: taskResponse, isLoading, error } = useGetAdminTask(taskId!);
  const updateMutation = useUpdateTask();
  
  const task = taskResponse?.data;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "EASY",
    rewardUsdc: 0,
    maxCompletions: 0,
    status: "ACTIVE"
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        level: task.level,
        rewardUsdc: parseFloat(task.rewardUsdc),
        maxCompletions: task.maxCompletions,
        status: task.status
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!taskId) return;
    
    try {
      await updateMutation.mutateAsync({
        id: taskId,
        input: formData
      });
      toast.success("Task updated", "The task has been updated successfully.");
    } catch (err: any) {
      toast.error("Update failed", getFriendlyErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <div className="glass rounded-xl p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-zinc-700 mb-4" />
        <h3 className="text-lg font-bold text-zinc-200">Task not found</h3>
        <Link to="/admin/tasks" className="text-amber-500 hover:underline mt-2">Back to Tasks</Link>
      </div>
    );
  }

  const progress = Math.round((task.completedCount / task.maxCompletions) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/tasks"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Manage Task</h2>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-[10px] font-mono text-zinc-600 mt-1 uppercase tracking-widest">{task.id}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-bold text-sm rounded-lg transition-all active:scale-95 shadow-lg shadow-amber-500/20"
        >
          {updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass rounded-xl p-5 sm:p-6 border border-zinc-800/50 space-y-6">
            <div className="flex items-center gap-2 text-zinc-400 pb-2 border-b border-zinc-800/50">
              <Settings size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider">General Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Task Title</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <section className="glass rounded-xl p-5 sm:p-6 border border-zinc-800/50 space-y-6">
            <div className="flex items-center gap-2 text-zinc-400 pb-2 border-b border-zinc-800/50">
              <DollarSign size={16} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Economics & Limits</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Reward (USDC)</label>
                  {task.completedCount > 0 && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase">
                      <AlertCircle size={10} /> Locked
                    </span>
                  )}
                </div>
                <div className="relative group/reward">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.rewardUsdc}
                    disabled={task.completedCount > 0}
                    onChange={(e) => setFormData({ ...formData, rewardUsdc: parseFloat(e.target.value) })}
                    className={cn(
                      "w-full pl-8 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all",
                      task.completedCount > 0 && "opacity-60 cursor-not-allowed bg-zinc-900"
                    )}
                  />
                  {task.completedCount > 0 && (
                    <div className="absolute left-0 -bottom-6 opacity-0 group-hover/reward:opacity-100 transition-opacity pointer-events-none">
                      <p className="text-[9px] text-zinc-500 italic whitespace-nowrap">Rewards cannot be changed after users have completed the task.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Max Completions</label>
                <input 
                  type="number"
                  value={formData.maxCompletions}
                  onChange={(e) => setFormData({ ...formData, maxCompletions: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Difficulty Level</label>
                <div className="flex gap-2">
                  {["EASY", "MEDIUM", "HARD"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setFormData({ ...formData, level: l as any })}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border",
                        formData.level === l 
                          ? "bg-zinc-100 text-zinc-900 border-zinc-100" 
                          : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-1">Task Status</label>
                <div className="flex gap-2">
                  {["ACTIVE", "PAUSED", "COMPLETED"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, status: s as any })}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all border",
                        formData.status === s 
                          ? s === "PAUSED" ? "bg-amber-500 text-black border-amber-500" :
                            s === "COMPLETED" ? "bg-zinc-500 text-black border-zinc-500" :
                            "bg-emerald-500 text-black border-emerald-500"
                          : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Stats & Info */}
        <div className="space-y-6">
          <section className="glass rounded-xl p-5 border border-zinc-800/50 space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 pb-2 border-b border-zinc-800/50">
              <Activity size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Performance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600">Completions</span>
                <span className="text-sm font-mono font-bold text-zinc-200">{task.completedCount} / {task.maxCompletions}</span>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-right text-zinc-600 font-bold uppercase tracking-widest">{progress}% Capacity Used</p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-600 flex items-center gap-1.5"><Users size={12} /> Total Submissions</span>
                <span className="text-xs font-mono text-zinc-400">{task._count?.submissions || 0}</span>
              </div>
              <Link 
                to={`/admin/tasks/${task.id}/submissions`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors"
              >
                View All Submissions
              </Link>
            </div>
          </section>

          <section className="glass rounded-xl p-5 border border-zinc-800/50 space-y-4">
             <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Task Steps</h3>
             <div className="space-y-2">
                {task.steps?.map((step: any, idx: number) => (
                  <div key={step.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/30 flex items-start gap-3">
                    <span className="text-[10px] font-mono text-zinc-700 mt-0.5">{idx + 1}.</span>
                    <div>
                      <p className="text-xs font-bold text-zinc-300">{step.title}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{step.type}</p>
                    </div>
                  </div>
                ))}
             </div>
             <p className="text-[9px] text-zinc-700 italic text-center">Steps are immutable once created.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
