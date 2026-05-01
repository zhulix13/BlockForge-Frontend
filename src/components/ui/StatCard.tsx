import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  accent?: string; // tailwind border color class
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "border-l-amber-500",
  className,
}: StatCardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <div
      className={cn(
        "glass rounded-xl border-l-[3px] p-4 sm:p-5 transition-all duration-200",
        "hover:bg-white/[0.04] group",
        accent,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tabular-nums text-zinc-50 tracking-tight">
            {value}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors">
          <Icon size={20} className="text-zinc-400" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-zinc-800/60">
          {isPositive && <TrendingUp size={14} className="text-emerald-400" />}
          {isNegative && <TrendingDown size={14} className="text-red-400" />}
          {!isPositive && !isNegative && <Minus size={14} className="text-zinc-500" />}
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              isPositive && "text-emerald-400",
              isNegative && "text-red-400",
              !isPositive && !isNegative && "text-zinc-500"
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-zinc-600">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
