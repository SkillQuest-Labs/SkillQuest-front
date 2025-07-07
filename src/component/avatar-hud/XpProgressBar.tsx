interface XpProgressBarProps {
  xpUser: number;
  xpMax: number;
  level: number;
}

export const XpProgressBar = ({ xpUser, xpMax, level }: XpProgressBarProps) => {
  const xpPercent = Math.min((xpUser / xpMax) * 100, 100);

  return (
    <div className="relative w-full">
      <div className="w-full h-4 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40 shadow-inner flex">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(251,191,36,0.4)]"
          style={{ width: `${xpPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 px-1 text-[0.75rem] font-medium text-slate-300">
        <span className="hover:text-slate-100 transition-colors duration-200">LVL {level}</span>
        <span className="hover:text-slate-100 transition-colors duration-200">{`${xpUser} / ${xpMax} XP`}</span>
      </div>
    </div>
  );
};
