import { cn } from "../../lib/cn";

type BadgeVariant =
  | "active" | "paused" | "completed"
  | "pending" | "approved" | "rejected"
  | "user" | "admin" | "superadmin";

const variants: Record<BadgeVariant, string> = {
  active:     "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  paused:     "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
  completed:  "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  pending:    "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  approved:   "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  rejected:   "bg-red-500/10 text-red-400 ring-red-500/20",
  user:       "bg-violet-500/10 text-violet-400 ring-violet-500/20",
  admin:      "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  superadmin: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase() as BadgeVariant;
  const style = variants[key] ?? "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md ring-1 ring-inset",
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
