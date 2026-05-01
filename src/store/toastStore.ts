import { create } from "zustand";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

let toastCounter = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    set((s) => ({
      toasts: [...s.toasts.slice(-4), { ...toast, id }], // max 5
    }));
    // Auto dismiss
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearAll: () => set({ toasts: [] }),
}));

// Convenience hook
export function useToast() {
  const addToast = useToastStore((s) => s.addToast);
  return {
    success: (title: string, message?: string) =>
      addToast({ title, message, variant: "success" }),
    error: (title: string, message?: string) =>
      addToast({ title, message, variant: "error" }),
    warning: (title: string, message?: string) =>
      addToast({ title, message, variant: "warning" }),
    info: (title: string, message?: string) =>
      addToast({ title, message, variant: "info" }),
  };
}
