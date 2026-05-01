import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  X, Plus, Trash2, ChevronRight, ChevronLeft, 
  AlertCircle, CheckCircle2, Save, Info,
  Heart, Repeat2, MessageCircle, UserPlus
} from "lucide-react";
import { cn } from "../../lib/cn";
import { useCreateTask } from "../../api/hooks/task.hooks";
import { useToast } from "../../store/toastStore";
import { StepType, TaskLevel } from "../../api/types/shared.types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { CreateTaskConfirm } from "./CreateTaskConfirm";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEP_ICONS: Record<StepType, any> = {
  FOLLOW: UserPlus,
  LIKE: Heart,
  RETWEET: Repeat2,
  COMMENT: MessageCircle,
};

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const isMobile = useIsMobile();
  const toast = useToast();
  const createTask = useCreateTask();

  const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: Confirm
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "EASY" as TaskLevel,
    rewardUsdc: 0.1,
    maxCompletions: 100,
    steps: [
      {
        title: "",
        description: "",
        type: "LIKE" as StepType,
        targetUrl: "",
        requiresLink: true,
        order: 0,
      },
    ],
  });

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: "",
          description: "",
          type: "LIKE" as StepType,
          targetUrl: "",
          requiresLink: true,
          order: prev.steps.length,
        },
      ],
    }));
  };

  const handleRemoveStep = (index: number) => {
    if (formData.steps.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })),
    }));
  };

  const handleUpdateStep = (index: number, updates: any) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    }));
  };

  const handleSubmit = async () => {
    try {
      await createTask.mutateAsync(formData);
      toast.success("Task Created", "The new task has been successfully forged.");
      onClose();
    } catch (err: any) {
      toast.error("Creation Failed", err.response?.data?.message || "Something went wrong.");
    }
  };

  const canGoToNext = formData.title && formData.rewardUsdc > 0 && formData.steps.every(s => s.title && s.targetUrl);

  const modalVariants = {
    hidden: isMobile ? { x: "100%" } : { opacity: 0, scale: 0.95, y: 20 },
    visible: isMobile ? { x: 0 } : { opacity: 1, scale: 1, y: 0 },
    exit: isMobile ? { x: "100%" } : { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col",
              isMobile ? "w-full h-full" : "w-full max-w-3xl max-h-[90vh] rounded-2xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Plus className="text-amber-500" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100">Forge New Task</h2>
                  <p className="text-xs text-zinc-500">
                    Step {step} of 2: {step === 1 ? "Details & Actions" : "Review & Confirm"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {step === 1 ? (
                <div className="space-y-8">
                  {/* Basic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Task Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Like and Follow Blockforge"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Description</label>
                      <textarea
                        rows={4}
                        placeholder="Explain what the hunter needs to do..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["EASY", "MEDIUM", "HARD"] as TaskLevel[]).map((l) => (
                          <button
                            key={l}
                            onClick={() => setFormData({ ...formData, level: l })}
                            className={cn(
                              "py-2 px-3 rounded-lg text-xs font-bold border transition-all",
                              formData.level === l
                                ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                            )}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Reward (USDC)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.rewardUsdc}
                          onChange={(e) => setFormData({ ...formData, rewardUsdc: parseFloat(e.target.value) })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Max Completions</label>
                      <input
                        type="number"
                        value={formData.maxCompletions}
                        onChange={(e) => setFormData({ ...formData, maxCompletions: parseInt(e.target.value) })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Steps Builder */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Steps Builder</label>
                      <button
                        onClick={handleAddStep}
                        className="text-xs font-bold text-amber-500 flex items-center gap-1.5 hover:text-amber-400 transition-colors"
                      >
                        <Plus size={14} />
                        Add Step
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.steps.map((stepData, index) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={index}
                          className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 space-y-4 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-zinc-600 font-bold uppercase tracking-tighter">
                              Step #{index + 1}
                            </span>
                            <button
                              onClick={() => handleRemoveStep(index)}
                              className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2 space-y-1.5">
                              <input
                                placeholder="Step Title (e.g., Like the pinned tweet)"
                                value={stepData.title}
                                onChange={(e) => handleUpdateStep(index, { title: e.target.value })}
                                className="w-full bg-transparent border-b border-zinc-800 py-1 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                              />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Step Description (Optional)</label>
                              <textarea
                                rows={2}
                                placeholder="Instructions for this specific action..."
                                value={stepData.description}
                                onChange={(e) => handleUpdateStep(index, { description: e.target.value })}
                                className="w-full bg-transparent border-b border-zinc-800 py-1 text-xs text-zinc-400 focus:outline-none focus:border-amber-500/50 transition-all resize-none"
                              />
                            </div>
                            
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Action Type</label>
                              <div className="flex gap-1.5">
                                {Object.keys(STEP_ICONS).map((type) => {
                                  const Icon = STEP_ICONS[type as StepType];
                                  return (
                                    <button
                                      key={type}
                                      onClick={() => handleUpdateStep(index, { type })}
                                      className={cn(
                                        "p-2 rounded-lg border transition-all",
                                        stepData.type === type
                                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                          : "bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700"
                                      )}
                                      title={type}
                                    >
                                      <Icon size={16} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Target URL</label>
                              <input
                                placeholder="https://x.com/..."
                                value={stepData.targetUrl}
                                onChange={(e) => handleUpdateStep(index, { targetUrl: e.target.value })}
                                className="w-full bg-transparent border-b border-zinc-800 py-1 text-xs text-zinc-400 focus:outline-none focus:border-amber-500/50 transition-colors"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <CreateTaskConfirm formData={formData} />
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-zinc-800 shrink-0 flex items-center justify-between bg-zinc-950">
              <button
                onClick={() => (step === 1 ? onClose() : setStep(1))}
                className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-200 transition-colors"
              >
                {step === 1 ? "Cancel" : <><ChevronLeft size={18} /> Back</>}
              </button>
              
              <button
                disabled={step === 1 ? !canGoToNext : createTask.isPending}
                onClick={() => (step === 1 ? setStep(2) : handleSubmit())}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                  "bg-amber-500 text-black hover:bg-amber-400 active:scale-95 disabled:opacity-50 disabled:active:scale-100",
                  createTask.isPending && "animate-pulse"
                )}
              >
                {step === 1 ? (
                  <>Continue <ChevronRight size={18} /></>
                ) : (
                  <>
                    {createTask.isPending ? "Forging..." : "Confirm & Launch"}
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
