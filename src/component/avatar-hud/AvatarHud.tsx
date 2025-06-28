import type { AvatarHudProps } from "./avatarHud.types";

export const AvatarHud = ({
  username,
  role,
  avatarUrl,
  level,
  xpUser,
  xpMax,
}: AvatarHudProps) => {
  const xpPercent = Math.min((xpUser / xpMax) * 100, 100);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl bg-[#0E172B]/95 backdrop-blur-md drop-shadow-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 hover:scale-99 hover:shadow-2xl">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-99">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col gap-y-1 w-64 text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold italic text-slate-200 bg-blue-600/40 px-2 py-0.5 rounded-full border border-blue-400/30 shadow-md hover:bg-blue-600/60 transition-all duration-200">
              {role}
            </span>
            <span className="text-lg font-bold text-slate-100 drop-shadow-[0_0_3px_rgba(0,0,0,0.6)] hover:text-white transition-colors duration-200">
              {username}
            </span>
          </div>
          <div className="relative w-full">
            <div className="w-full h-4 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40 shadow-inner flex flex-row-reverse">
              <div
                className="h-full bg-gradient-to-l from-amber-400 via-orange-400 to-rose-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(251,191,36,0.4)] animate-pulse"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 px-1 text-[0.75rem] font-medium text-slate-300">
              <span className="hover:text-slate-100 transition-colors duration-200">{`${xpUser} / ${xpMax} XP`}</span>
              <span className="hover:text-slate-100 transition-colors duration-200">
                LVL {level}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
