import { cn } from "../../../shared/utils/helpers";

type ProgressBarProps = {
  progress: number;
  className?: string;
  showLabel?: boolean;
};

const ProgressBar = ({ progress, className, showLabel = true }: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Progression</span>
          <span className="text-xs font-medium text-foreground">{clampedProgress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
        <div
          className={cn("h-2 rounded-full transition-all duration-300 ease-out", getProgressColor(clampedProgress))}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export { ProgressBar };
