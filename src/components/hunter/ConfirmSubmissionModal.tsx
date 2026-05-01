import { Modal } from '../ui/Modal';
import { Shield, Loader2 } from 'lucide-react';

interface ConfirmSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  taskTitle: string;
  rewardUsdc: string;
  stepCount: number;
  proofCount: number;
}

export function ConfirmSubmissionModal({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  taskTitle,
  rewardUsdc,
  stepCount,
  proofCount,
}: ConfirmSubmissionModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Submission" size="max-w-md">
      <div className="space-y-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Shield size={28} className="text-blue-400" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center space-y-1.5">
          <p className="text-sm text-zinc-400">
            You're about to submit proof for
          </p>
          <h3 className="text-base font-semibold text-zinc-100 leading-snug">
            {taskTitle}
          </h3>
        </div>

        {/* Details */}
        <div className="rounded-xl bg-zinc-800/50 border border-zinc-700/50 divide-y divide-zinc-700/50">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Reward</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              ${rewardUsdc} <span className="text-[10px] font-mono text-zinc-500">USDC</span>
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Steps</span>
            <span className="text-sm font-medium text-zinc-200 tabular-nums">{stepCount}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Proof Links</span>
            <span className="text-sm font-medium text-zinc-200 tabular-nums">{proofCount}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-zinc-500 uppercase tracking-wider">Screenshot</span>
            <span className="text-xs font-medium text-blue-400">✓ Selected</span>
          </div>
        </div>

        {/* Warning */}
        <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
          Once submitted, your proof will be reviewed by an admin. You cannot submit again for this task.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </>
            ) : (
              'Confirm & Submit'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
