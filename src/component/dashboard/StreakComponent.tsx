import { useMemo } from "react";
import { Flame } from "lucide-react";

interface StreakComponentProps {
  currentStreak: number;
  maxStreak?: number;
  className?: string;
}

export const StreakComponent = ({ currentStreak, maxStreak = 7, className = "" }: StreakComponentProps) => {
  const streakData = useMemo(() => {
    return Array.from({ length: maxStreak }, (_, index) => ({
      day: index + 1,
      isActive: index < currentStreak,
      isCurrent: index === currentStreak - 1,
    }));
  }, [currentStreak, maxStreak]);

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Commencez votre streak !";
    if (currentStreak === 1) return "Premier jour !";
    if (currentStreak < 7) return `${currentStreak} jours de suite !`;
    return "Streak parfait ! 🔥";
  };

  return (
    <div className={`bg-slate-800/50 rounded-xl p-6 border border-slate-600/30 backdrop-blur-sm ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-400/30">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Streak de connexion</h3>
            <p className="text-sm text-slate-400">{getStreakMessage()}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
          <div className="text-xs text-slate-400">jours</div>
        </div>
      </div>

      {/* Cercles de streak */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {streakData.map((day, index) => (
          <div key={day.day} className="flex items-center">
            {/* Cercle de jour */}
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                  day.isActive
                    ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-300 text-white shadow-lg shadow-orange-500/30"
                    : "bg-slate-700/50 border-slate-600 text-slate-400"
                } ${day.isCurrent ? "ring-2 ring-orange-400/50 ring-offset-2 ring-offset-slate-800" : ""}`}
              >
                {day.day}
              </div>

              {/* Indicateur de flamme pour le jour actuel */}
              {day.isCurrent && day.isActive && (
                <div className="absolute -top-1 -right-1">
                  <Flame className="w-3 h-3 text-orange-400" />
                </div>
              )}
            </div>

            {/* Ligne de connexion (sauf pour le dernier élément) */}
            {index < streakData.length - 1 && (
              <div
                className={`w-6 h-0.5 mx-1 transition-all duration-300 ${
                  day.isActive && streakData[index + 1].isActive
                    ? "bg-gradient-to-r from-orange-400 to-orange-500"
                    : "bg-slate-600"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progression et objectif */}
      <div className="space-y-3">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Progression</span>
            <span>
              {currentStreak}/{maxStreak}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-500 ease-out"
              style={{ width: `${(currentStreak / maxStreak) * 100}%` }}
            />
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="text-center">
          {currentStreak === 0 ? (
            <p className="text-sm text-slate-400">Connectez-vous demain pour commencer votre streak !</p>
          ) : currentStreak < maxStreak ? (
            <p className="text-sm text-orange-300">
              Plus que {maxStreak - currentStreak} jour{maxStreak - currentStreak > 1 ? "s" : ""} pour atteindre
              l'objectif !
            </p>
          ) : (
            <p className="text-sm text-green-400 font-medium">🎉 Objectif atteint ! Continuez comme ça !</p>
          )}
        </div>
      </div>
    </div>
  );
};
