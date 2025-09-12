import { cn } from "@/shared/utils/helpers";
import { badgeVariants, colorVariants } from "../stats.const";
import type { StatsCardProps } from "../types/stats.types";

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
  const progressPercentage = progress ? (progress.current / progress.max) * 100 : 0;

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-300 ease-out",
        "hover:scale-105 hover:-translate-y-1",
        className,
      )}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          colorConfig.glow,
        )}
      />

      <div
        className={cn(
          "relative bg-gradient-to-br backdrop-blur-sm border rounded-xl p-6",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-gray-900/80 border-gray-700/50",
          colorConfig.border,
          colorConfig.glow,
        )}
      >
        {badge && (
          <div className="absolute -top-2 -right-2 z-10">
            <span className={badgeVariants[badge.variant]}>{badge.text}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          </div>

          {/* Icon with glow effect */}
          <div className="relative">
            <div className={cn("absolute inset-0 rounded-lg blur-md opacity-50", colorConfig.iconShadow)} />
            <div className={cn("relative p-3 rounded-lg shadow-lg", colorConfig.iconBg)}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Progression</span>
              <span className="text-xs text-gray-300">
                {progress.current} / {progress.max}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  "bg-gradient-to-r",
                  colorConfig.iconBg,
                  "shadow-sm",
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {progress.label && <p className="text-xs text-gray-400 mt-2">{progress.label}</p>}
          </div>
        )}

        {/* Change indicator */}
        {change && (
          <div className="flex items-center">
            <span className={cn("text-sm font-medium", change.positive !== false ? "text-green-400" : "text-red-400")}>
              {change.value}
            </span>
            <span className="ml-2 text-sm text-gray-500">{change.label}</span>
          </div>
        )}

        {/* Animated border effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl opacity-0 ",
            "bg-gradient-to-r p-[1px] transition-opacity duration-300",
            colorConfig.bg,
          )}
        >
          <div className="w-full h-full bg-gray-900/90 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
