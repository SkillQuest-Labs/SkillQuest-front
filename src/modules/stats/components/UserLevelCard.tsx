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
  const progressPercentage = (currentXp / maxXp) * 100;
  const nextLevel = currentLevel + 1;
  const xpToNextLevel = maxXp - currentXp;

  return (
    <div
      className={cn(
        "relative group cursor-pointer transition-all duration-500 ease-out",
        "hover:scale-105 hover:-translate-y-2",
        className,
      )}
      onClick={onClick}
    >
      {/* Glow effect soft & smooth */}
      <div className="absolute inset-0 rounded-2xl blur-md opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500" />

      {/* Main card */}
      <div
        className={cn(
          "relative bg-gradient-to-br from-gray-900/95 via-purple-900/20 to-gray-900/95",
          "backdrop-blur-sm border-2 border-purple-500/40 rounded-2xl p-6",
          "shadow-xl hover:shadow-purple-500/10 transition-all duration-500",
          "flex flex-col justify-between",
        )}
      >
        {/* Badge légendaire */}
        <div className="absolute -top-3 -right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse shadow-md">
            NIVEAU {currentLevel}
          </div>
        </div>

        {/* Header with special icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-300 mb-2 tracking-wide uppercase">Niveau Actuel</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text">
                {currentLevel}
              </p>
              <p className="text-lg text-white font-medium">/ ∞</p>
            </div>
            <p className="text-xs text-white mt-1">{totalXp.toLocaleString()} XP Total</p>
          </div>

          {/* Icon with special effects */}
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-sm opacity-30 bg-gradient-to-r from-purple-500 to-pink-500" />
            <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 shadow-xl">
              <Icon className="h-8 w-8 text-white drop-shadow" />
            </div>

            <div className="absolute inset-0 rounded-xl border-2 border-purple-400/10" />
            <div className="absolute inset-0 rounded-xl border border-pink-400/10" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>

        {/* Advanced XP Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-300 font-medium">Progression vers Niveau {nextLevel}</span>
            <span className="text-gray-300 font-mono">
              {currentXp.toLocaleString()} / {maxXp.toLocaleString()}
            </span>
          </div>

          {/* Progress bar with effects */}
          <div className="relative">
            <div className="w-full bg-gray-800/60 rounded-full h-4 overflow-hidden border border-gray-700/50">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-2000 ease-out relative overflow-hidden",
                  "bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500",
                  "shadow-md shadow-purple-500/20",
                )}
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Moving shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
            </div>

            {/* Progress indicator */}
            <div
              className="absolute top-0 h-4 w-1 bg-white/60 rounded-full transition-all duration-2000 ease-out shadow"
              style={{ left: `${progressPercentage}%`, transform: "translateX(-50%)" }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{Math.round(progressPercentage)}% complété</span>
            <span className="text-purple-300 font-medium">{xpToNextLevel.toLocaleString()} XP restants</span>
          </div>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-yellow-500/10 p-[2px]">
            <div className="w-full h-full bg-gray-900/90 rounded-2xl" />
          </div>
        </div>

        {/* Inner glow effect */}
        <div className="absolute inset-4 rounded-xl bg-gradient-to-r from-purple-500/2 via-pink-500/2 to-yellow-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};
