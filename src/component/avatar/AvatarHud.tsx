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
      <div className="flex flex-row-reverse items-center gap-4 p-4 rounded-xl bg-stone-100/30 backdrop-blur-md drop-shadow-md border border-neutral-300/40">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-800 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-1 w-64 text-right">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold italic text-white bg-indigo-600/30 px-2 py-0.5 rounded-full border border-indigo-300/30 shadow">
              {role}
            </span>
            <span className="text-lg font-bold text-neutral-900 drop-shadow-[0_0_2px_rgba(0,0,0,0.4)]">
              {username}
            </span>
          </div>
          <div className="relative w-full">
            <div className="w-full h-4 bg-neutral-300/50 rounded-full overflow-hidden border border-neutral-400/30 shadow-inner flex flex-row-reverse">
              <div
                className="h-full bg-gradient-to-l from-amber-400 via-orange-400 to-rose-400 transition-all duration-500 shadow-[0_0_6px_rgba(0,0,0,0.4)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 px-1 text-[0.75rem] font-medium text-neutral-700">
              <span>{`${xpUser} / ${xpMax} XP`}</span>
              <span>LVL {level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
