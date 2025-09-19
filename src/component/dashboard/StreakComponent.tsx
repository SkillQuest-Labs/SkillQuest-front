interface StreakComponentProps {
  currentStreak: number;
  maxStreak?: number;
  className?: string;
}

export const StreakComponent = ({ currentStreak, maxStreak = 7, className = "" }: StreakComponentProps) => {
  const streakData = Array.from({ length: maxStreak }, (_, index) => ({
    day: index + 1,
    isActive: index < currentStreak,
    isCurrent: index === currentStreak - 1,
  }));

  return (
    <div
      className={`bg-slate-800/50 rounded-xl p-3 border border-slate-600/30 backdrop-blur-sm flex items-center justify-start w-fit h-16 ${className}`}
    >
      {/* Description à gauche */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <p className="text-slate-400 text-xs">Streak</p>
          <p className="text-slate-200 text-sm font-semibold">
            {currentStreak} jour{currentStreak > 1 ? "s" : ""}
          </p>
        </div>
 
        {/* Barre avec les cercles et les jours */}
        <div className="flex items-center gap-0.5">
          {streakData.map((day, index) => (
            <div key={day.day} className="flex items-center">
              {/* Cercle de jour */}
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    day.isActive
                      ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-300 text-white shadow-lg shadow-orange-500/30"
                      : "bg-slate-700/50 border-slate-600 text-slate-400"
                  } ${day.isCurrent ? "ring-1 ring-orange-400/50 ring-offset-1 ring-offset-slate-800" : ""}`}
                >
                  {day.day}
                </div>
              </div>

              {/* Ligne de connexion (sauf pour le dernier élément) */}
              {index < streakData.length - 1 && (
                <div
                  className={`w-2 h-0.5 mx-0.5 transition-all duration-300 ${
                    day.isActive && streakData[index + 1].isActive
                      ? "bg-gradient-to-r from-orange-400 to-orange-500"
                      : "bg-slate-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
