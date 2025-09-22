// src/component/dashboard/StreakComponent.tsx
type DayDot = {
  dayIndex: number;
  isActive: boolean;
  isCurrent: boolean;
  label: string;
};

interface StreakComponentProps {
  /** Option A: vous passez un tableau de dates ISO (quêtes complétées / sessions) → streak auto */
  dates?: string[];
  /** Option B: comportement legacy si pas de dates */
  currentStreak?: number;
  maxStreak?: number;
  className?: string;
}

import { useStreakFromDates } from "@/shared/hooks/useStreakFromDates";

export const StreakComponent = ({
  dates,
  currentStreak: legacyCurrent = 0,
  maxStreak = 7,
  className = "",
}: StreakComponentProps) => {
  // Si on a des dates → dynamique, sinon on retombe sur l’ancien affichage
  const dynamic = !!dates && dates.length > 0;
  const { currentStreak, days } = useStreakFromDates(dates || [], maxStreak);

  // Données pour la grille
  const streakCount = dynamic ? currentStreak : legacyCurrent;
  const streakData: DayDot[] = dynamic
    ? days
    : Array.from({ length: maxStreak }, (_, i) => ({
        dayIndex: i + 1,
        isActive: i < legacyCurrent,
        isCurrent: i === legacyCurrent - 1,
        label: "",
      }));

  return (
    <div
      className={`bg-slate-800/80 rounded-xl p-2 border border-slate-600/50 backdrop-blur-sm flex items-center justify-between w-full h-16 shadow-xl ${className}`}
    >
      {/* Label à gauche */}
      <div className="flex flex-col items-start flex-shrink-0 min-w-[60px]">
        <p className="text-slate-400 text-xs font-medium mb-0">Streak</p>
        <p className="text-white text-sm sm:text-base lg:text-lg font-bold">
          {streakCount} jour{streakCount > 1 ? "s" : ""}
        </p>
      </div>

      {/* Pastilles de jours */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center">
        {streakData.map((day, idx) => (
          <div key={idx} className="flex items-center">
            <div className="relative" title={day.label}>
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300
                ${
                  day.isActive
                    ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-300 text-white shadow-lg shadow-orange-500/50"
                    : "bg-slate-700/60 border-slate-600 text-slate-300"
                }
                ${day.isCurrent ? "ring-1 ring-orange-400/60 ring-offset-1 ring-offset-slate-800" : ""}
              `}
              >
                {day.dayIndex}
              </div>
            </div>

            {/* Connecteur */}
            {idx < streakData.length - 1 && (
              <div
                className={`w-1 sm:w-1.5 h-0.5 mx-0.5 transition-all duration-300 ${
                  day.isActive && streakData[idx + 1].isActive
                    ? "bg-gradient-to-r from-orange-400 to-orange-500"
                    : "bg-slate-600"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
