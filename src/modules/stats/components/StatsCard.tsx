import { cn } from "@/shared/utils/helpers";
import { badgeVariants, colorVariants } from "../stats.const";
import type { StatsCardProps } from "../types/stats.types";

const accentDotClass: Record<StatsCardProps["color"], string> = {
  blue: "bg-blue-400",
  purple: "bg-purple-400",
  green: "bg-emerald-400",
  orange: "bg-orange-400",
  red: "bg-rose-400",
  yellow: "bg-amber-400",
};

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  progress,
  change,
  badge,
  className,
  onClick,
}: StatsCardProps) => {
  const colorConfig = colorVariants[color];
  const accentClass = accentDotClass[color];
  const isClickable = Boolean(onClick);

  const safeCurrent = progress ? Math.max(progress.current, 0) : 0;
  const safeMax = progress ? Math.max(progress.max, 1) : 1;
  const progressPercentage = progress ? Math.min((safeCurrent / safeMax) * 100, 100) : 0;

  return (
    <div
      className={cn(
        "group relative h-full transition-transform duration-300 ease-out",
        isClickable ? "cursor-pointer hover:scale-[1.02]" : "cursor-default",
        className,
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 blur-xl transition-opacity duration-300",
          "bg-gradient-to-br",
          colorConfig.bg,
          "group-hover:opacity-100",
        )}
      />

      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-600/40",
          "bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/80",
          "shadow-lg shadow-black/30",
          colorConfig.border,
        )}
      >
        {badge && (
          <div className="absolute right-4 top-4 z-10">
            <span className={badgeVariants[badge.variant]}>{badge.text}</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span className={cn("h-2 w-2 rounded-full", accentClass)} />
              <span>{title}</span>
            </div>
            <p className="text-3xl font-semibold text-white">{value.toLocaleString()}</p>
            {change && !progress && (
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("font-semibold", change.positive !== false ? "text-emerald-400" : "text-rose-400")}>
                  {change.value}
                </span>
                <span className="text-slate-400">{change.label}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <div className={cn("absolute inset-0 rounded-lg blur opacity-60", colorConfig.iconShadow)} />
            <div
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700/40",
                colorConfig.iconBg,
                "shadow-lg",
              )}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {(progress || change) && (
          <div className="mt-auto flex flex-col gap-4 border-t border-slate-700/40 bg-slate-900/55 px-6 py-4">
            {progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Progression</span>
                  <span>
                    {safeCurrent.toLocaleString()} / {safeMax.toLocaleString()}
                  </span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-800/70">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                      colorConfig.iconBg,
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {progress.label && <p className="text-xs text-slate-400">{progress.label}</p>}
              </div>
            )}

            {change && progress && (
              <div className="flex items-center gap-2 text-xs">
                <span className={cn("font-semibold", change.positive !== false ? "text-emerald-400" : "text-rose-400")}>
                  {change.value}
                </span>
                <span className="text-slate-400">{change.label}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
