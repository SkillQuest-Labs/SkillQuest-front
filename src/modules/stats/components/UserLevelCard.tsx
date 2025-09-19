import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/helpers";

export type UserLevelCardProps = {
  currentLevel: number;
  currentXp: number;
  maxXp: number;
  totalXp: number;
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
};

export const UserLevelCard = ({
  currentLevel,
  currentXp,
  maxXp,
  totalXp,
  icon: Icon,
  className,
  onClick,
}: UserLevelCardProps) => {
  const safeCurrentXp = Math.max(currentXp, 0);
  const safeMaxXp = Math.max(maxXp, 1);
  const safeTotalXp = Math.max(totalXp, 0);
  const progressPercentage = Math.min((safeCurrentXp / safeMaxXp) * 100, 100);
  const nextLevel = currentLevel + 1;
  const xpToNextLevel = Math.max(maxXp - currentXp, 0);
  const showAsButton = Boolean(onClick);

  return (
    <div
      className={cn(
        "group relative transition-all duration-300 ease-out",
        showAsButton ? "cursor-pointer hover:scale-[1.02]" : "cursor-default",
        className,
      )}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-600/40",
          "bg-gradient-to-br from-slate-900/70 via-slate-900/40 to-slate-900/80",
          "shadow-lg shadow-black/30",
        )}
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="flex items-start justify-between gap-4 p-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
              Niveau {currentLevel}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">Progression personnelle</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl font-semibold text-white">{currentLevel}</span>
                <span className="text-sm text-slate-400">{safeTotalXp.toLocaleString()} XP total</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-slate-400">Prochain niveau</p>
              <p className="text-sm font-medium text-cyan-200">Niveau {nextLevel}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-cyan-500/25 blur" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-800">
                <Icon className="h-6 w-6 text-cyan-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-700/50 bg-slate-900/50 px-6 py-5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Vers le niveau {nextLevel}</span>
            <span>
              {safeCurrentXp.toLocaleString()} / {safeMaxXp.toLocaleString()} XP
            </span>
          </div>

          <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-800/70">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{Math.round(progressPercentage)}% complété</span>
            <span>{xpToNextLevel > 0 ? `${xpToNextLevel.toLocaleString()} XP restants` : "Niveau atteint"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
