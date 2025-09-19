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
      className={`bg-slate-800/80 rounded-xl p-2 border border-slate-600/50 backdrop-blur-sm flex items-center justify-between w-full h-16 shadow-xl ${className}`}
    >
      {/* Description à gauche */}
      <div className="flex flex-col items-start flex-shrink-0 min-w-[60px]">
        <p className="text-slate-400 text-xs font-medium mb-0">Streak</p>
        <p className="text-white text-sm sm:text-base lg:text-lg font-bold">
          {currentStreak} jour{currentStreak > 1 ? "s" : ""}
        </p>
      </div>

      {/* Barre avec les cercles et les jours */}
      <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center">
        {streakData.map((day, index) => (
          <div key={day.day} className="flex items-center">
            {/* Cercle de jour */}
            <div className="relative">
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  day.isActive
                    ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-300 text-white shadow-lg shadow-orange-500/50"
                    : "bg-slate-700/60 border-slate-600 text-slate-400"
                } ${day.isCurrent ? "ring-1 ring-orange-400/60 ring-offset-1 ring-offset-slate-800" : ""}`}
              >
                {day.day}
              </div>
            </div>

            {/* Ligne de connexion (sauf pour le dernier élément) */}
            {index < streakData.length - 1 && (
              <div
                className={`w-1 sm:w-1.5 h-0.5 mx-0.5 transition-all duration-300 ${
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
  );
};
