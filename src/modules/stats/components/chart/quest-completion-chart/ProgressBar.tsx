import type { QuestCompletionMetric } from "@/modules/stats/types/stats.types";
import { useEffect, useState } from "react";
import { levelColors, levelIcons } from "./quest-completion-chart.const";

type TooltipData = {
  metric: QuestCompletionMetric;
  level: number;
  currentIcon: string;
  position: { x: number; y: number };
};

type ProgressBarProps = {
  metric: QuestCompletionMetric;
  index: number;
  viewMode: "grid" | "compact";
  onTooltipShow?: (data: TooltipData) => void;
  onTooltipHide?: () => void;
};

export const ProgressBar = ({ metric, index, viewMode, onTooltipShow, onTooltipHide }: ProgressBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const percentage = metric.totalQuests > 0 ? (metric.completedQuests / metric.totalQuests) * 100 : 0;
  const level = Math.floor(percentage / 20) + 1;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (onTooltipShow) {
      const rect = e.currentTarget.getBoundingClientRect();
      onTooltipShow({
        metric,
        level,
        currentIcon,
        position: {
          x: rect.left + rect.width / 2,
          y: rect.top,
        },
      });
    }
  };

  const handleMouseLeave = () => {
    if (onTooltipHide) {
      onTooltipHide();
    }
  };

  const currentColor = levelColors[Math.min(level - 1, 4)];
  const currentIcon = levelIcons[Math.min(level - 1, 4)];

  if (viewMode === "compact") {
    return (
      <div
        className="relative flex items-center gap-4 p-2 bg-slate-800/20 rounded-lg border border-slate-600/20 hover:border-slate-500/40 transition-all duration-300 group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{currentIcon}</span>
            <span className="text-sm font-medium text-slate-300">{metric.skillName}</span>
            <span className="ml-auto text-xs text-blue-300 font-bold">Lv. {level}</span>
          </div>
          <div className="relative w-full h-4 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/30 shadow-inner">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${currentColor}`}
              style={{
                width: isVisible ? `${percentage}%` : "0%",
                boxShadow: isVisible && percentage === 100 ? "0 0 12px 4px #60a5fa" : undefined,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            {/* XP "sparkle" */}
            {isVisible && percentage > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  left: `calc(${Math.min(percentage, 100)}% - 12px)`,
                  transition: "left 1s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <span className="text-yellow-300 text-lg drop-shadow-glow">{currentIcon}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center group cursor-pointer transform hover:scale-105 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Skill Name & Level */}
      <div className="flex items-center gap-2 mb-2 min-h-8">
        <span className="text-xl">{currentIcon}</span>
        <span className="text-sm font-medium text-slate-300 text-center">{metric.skillName}</span>
      </div>
      <div className="text-xs text-blue-300 font-bold mb-1">Niveau {level}</div>

      {/* Gamified Progress Bar */}
      <div className="relative w-12 h-36 bg-slate-800/60 rounded-2xl border-2 border-slate-600/40 overflow-hidden shadow-lg flex flex-col justify-end">
        {/* Level "steps" */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={"absolute left-0 w-full border-b border-dashed border-blue-400/30"}
            style={{
              bottom: `${i * 20}%`,
              zIndex: 2,
            }}
          />
        ))}
        {/* Progress Fill */}
        <div
          className={`absolute left-0 bottom-0 w-full rounded-b-2xl transition-all duration-1000 ease-out bg-gradient-to-t ${currentColor}`}
          style={{
            height: isVisible ? `${percentage}%` : "0%",
            boxShadow: isVisible && percentage === 100 ? "0 0 24px 8px #60a5fa" : undefined,
            zIndex: 1,
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
        {/* XP "sparkle" icon */}
        {isVisible && percentage > 0 && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: `calc(${Math.min(percentage, 100)}% - 16px)`,
              transition: "bottom 1s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 3,
            }}
          >
            <span className="text-yellow-300 text-2xl drop-shadow-glow">{currentIcon}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center mt-2">
        <div className="text-xs font-bold text-white bg-slate-700/50 px-2 py-1 rounded-full border border-slate-600/30 mt-1">
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
