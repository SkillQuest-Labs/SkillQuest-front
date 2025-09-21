// src/component/profile/ProfileSkillHud.tsx

export type SkillSlot = {
  id: string;
  name: string;
  icon: string; // URL (ex: /icons/skill-x.png)
  progress: number; // 0..100
  status?: "LOCKED" | "ACTIVE" | "COMPLETED";
  keyLabel?: string; // ex: "Q", "W", "E", "R" ou "1","2","3","4"
  onClick?: () => void;
};

export type ProfileSkillHudProps = {
  avatarUrl: string;
  username: string;
  level: number;
  skills: SkillSlot[]; // on affiche les 4 premiers par défaut
  showXpBar?: boolean;
  currentXp?: number;
  xpToNext?: number;
  className?: string;
};

const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export default function ProfileSkillHud({
  avatarUrl,
  username,
  level,
  skills,
  showXpBar = false,
  currentXp = 0,
  xpToNext = 100,
  className = "",
}: ProfileSkillHudProps) {
  const pct = clampPct((currentXp / Math.max(1, xpToNext)) * 100);
  const visible = skills.slice(0, 4);

  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center ${className}`}>
      <div className="pointer-events-auto w-[min(1080px,95vw)] rounded-2xl border border-amber-400/20 bg-slate-900/70 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.45)] px-4 py-3">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Avatar + pseudo + niveau + (option) barre d'XP */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 flex items-center gap-3">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={username}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-amber-400/40 shadow"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold shadow">
                LVL {level}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold truncate">{username}</div>

              {showXpBar && (
                <>
                  <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden border border-yellow-400/30">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 transition-[width] duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[11px] text-yellow-200/70">
                    {currentXp.toLocaleString()} / {xpToNext.toLocaleString()} XP
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SKILLS */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9 flex items-center justify-center gap-3 flex-wrap">
            {visible.map((sk) => {
              const p = clampPct(sk.progress);
              const statusRing =
                sk.status === "COMPLETED"
                  ? "ring-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,.45)]"
                  : sk.status === "ACTIVE"
                    ? "ring-amber-300/70 shadow-[0_0_10px_rgba(251,191,36,.35)]"
                    : "ring-slate-600/60";

              return (
                <button
                  key={sk.id}
                  onClick={sk.onClick}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden ring-2 ${statusRing} border border-slate-600/40 bg-slate-800/50 hover:scale-105 transition`}
                  title={`${sk.name} • ${p}%`}
                >
                  <img src={sk.icon} alt={sk.name} className="w-full h-full object-cover opacity-95" />

                  {/* bandeau nom */}
                  <div className="absolute inset-x-0 bottom-4 px-1 text-[10px] text-white/90 truncate text-center drop-shadow">
                    {sk.name}
                  </div>

                  {/* barre de progression */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/70">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-500" style={{ width: `${p}%` }} />
                  </div>

                  {/* label / touche */}
                  {sk.keyLabel && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] rounded px-1 py-0.5 bg-slate-800/80 border border-slate-600 text-slate-200">
                      {sk.keyLabel}
                    </div>
                  )}
                </button>
              );
            })}

            {visible.length === 0 && (
              <div className="text-slate-300 text-sm opacity-80">Aucune compétence sélectionnée.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
