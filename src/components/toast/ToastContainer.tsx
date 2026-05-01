import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "../../store/toastStore";
import type { ToastVariant } from "../../store/toastStore";

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; border: string; iconColor: string }
> = {
  success: { icon: CheckCircle2, border: "border-l-emerald-500", iconColor: "text-emerald-400" },
  error: { icon: AlertCircle, border: "border-l-red-500", iconColor: "text-red-400" },
  warning: { icon: AlertTriangle, border: "border-l-amber-500", iconColor: "text-amber-400" },
  info: { icon: Info, border: "border-l-blue-500", iconColor: "text-blue-400" },
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex flex-col-reverse gap-2 w-[calc(100vw-2rem)] max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = variantConfig[toast.variant];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`
                relative overflow-hidden rounded-lg border-l-[3px] ${config.border}
                bg-zinc-900/95 backdrop-blur-sm border border-zinc-800
                shadow-lg shadow-black/30
                flex items-start gap-3 p-3.5
              `}
            >
              <Icon size={18} className={`${config.iconColor} shrink-0 mt-0.5`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 leading-tight">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
