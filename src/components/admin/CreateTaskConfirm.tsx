import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";

interface CreateTaskConfirmProps {
  formData: {
    title: string;
    description: string;
    rewardUsdc: number;
    maxCompletions: number;
    steps: Array<{
      title: string;
      description?: string;
    }>;
  };
}

export function CreateTaskConfirm({ formData }: CreateTaskConfirmProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-amber-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-zinc-100">Review Before Forging</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Please confirm the task details. Rewards are immutable once submissions begin.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Reward</p>
            <p className="text-2xl font-bold text-zinc-100">${formData.rewardUsdc.toFixed(2)} <span className="text-xs font-mono text-zinc-500">USDC</span></p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Max Slots</p>
            <p className="text-2xl font-bold text-zinc-100">{formData.maxCompletions}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-amber-500/70" />
            <h4 className="text-sm font-bold text-zinc-300">Task Summary</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-zinc-400"><span className="text-zinc-200 font-medium">Title:</span> {formData.title}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-zinc-400"><span className="text-zinc-200 font-medium">Steps:</span> {formData.steps.length} actions configured</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-sm text-zinc-400"><span className="text-zinc-200 font-medium">Total Cost:</span> ${(formData.rewardUsdc * formData.maxCompletions).toLocaleString()} USDC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
