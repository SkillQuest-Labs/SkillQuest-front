import { XpProgressBar } from "./XpProgressBar";

// + deux props optionnelles: userClass, badgeSrc
export type AvatarHudProps = {
  username: string;
  role: string;
  avatarUrl: string;
  level: number;
  xpUser: number;
  xpMax: number;
  userClass?: string;
  badgeSrc?: string;
};

export const AvatarHud = ({ username, role, avatarUrl, level, xpUser, xpMax, userClass, badgeSrc }: AvatarHudProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-row items-center gap-4 p-4 rounded-xl bg-[#0E172B]/95 backdrop-blur-md drop-shadow-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          {badgeSrc && <img src={badgeSrc} alt="badge" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full shadow" />}
        </div>

        <div className="flex flex-col gap-y-1 w-64 text-right">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-100">{username}</span>
            <span className="text-xs font-semibold italic text-slate-200 bg-blue-600/40 px-2 py-0.5 rounded-full border border-blue-400/30">
              {userClass ?? role}
            </span>
          </div>
          {/* ta barre existante */}
          <XpProgressBar xpUser={xpUser} xpMax={xpMax} level={level} />
        </div>
      </div>
    </div>
  );
};
