import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Width class, e.g. "sm", "md", "lg", "full" */
  size?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = "lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full h-full sm:h-auto sm:max-w-lg",
  };

  const selectedSize = sizeClasses[size as keyof typeof sizeClasses] || size;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed inset-0 z-[999] flex justify-center",
            size === "full" ? "items-stretch sm:items-center" : "items-center",
            size === "full" ? "p-0 sm:p-4" : "p-4"
          )}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

          {/* Panel */}
          <motion.div
            initial={size === "full" ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={size === "full" ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col overflow-hidden",
              size === "full" ? "rounded-none sm:rounded-3xl" : "rounded-3xl max-h-[90vh]",
              selectedSize,
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 shrink-0 bg-zinc-950/80 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {title || "Modal"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
               <div className="p-6">
                {children}
               </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
