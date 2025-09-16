import { Check, Pencil, X } from "lucide-react";
import { useMemo, useState } from "react";

import badgeApprenti from "@/assets/badges/badge-apprenti.png";
import badgeIntermediaire from "@/assets/badges/badge-intermediare.png";
import badgeExpert from "@/assets/badges/badge-expert.png";
import badgeMentor from "@/assets/badges/badge-mentor.png";

export type Badge = { id: string; label: string };
export type AvatarChoice = { id: string; url: string; label?: string };

type ProfileHudProps = {
  userName: string;
  title?: string;
  level: number;
  xp: number;
  xpToNext: number;
  badges?: Array<string | Badge>;
  avatarUrl?: string;
  avatarChoices?: AvatarChoice[];
  onAvatarChange?: (choice: AvatarChoice) => void;
  className?: string;
};

const DEFAULT_AVATARS: AvatarChoice[] = [
  { id: "knight", url: "src/shared/constants/avatar/profile.jpg", label: "Chevalier" },
  { id: "mage", url: "src/shared/constants/avatar/profile1.jpg", label: "Mage" },
  { id: "archer", url: "src/shared/constants/avatar/profile2.jpg", label: "Archer" },
  { id: "robot", url: "src/shared/constants/avatar/profile4.jpg", label: "Robot" },
];

const getLevelIcon = (level: number): { icon: string; label: string } => {
  if (level < 5) return { icon: "🌱", label: "Débutant" };
  if (level < 10) return { icon: "⚔️", label: "Aventurier" };
  if (level < 20) return { icon: "🛡️", label: "Guerrier" };
  if (level < 30) return { icon: "🔥", label: "Élite" };
  if (level < 50) return { icon: "👑", label: "Maître" };
  return { icon: "🌌", label: "Légende" };
};

const getBadgeForLevel = (level: number): { image: string; title: string } => {
  if (level >= 30) return { image: badgeMentor, title: "Mentor" };
  if (level >= 20) return { image: badgeExpert, title: "Expert" };
  if (level >= 10) return { image: badgeIntermediaire, title: "Intermédiaire" };
  return { image: badgeApprenti, title: "Apprenti" };
};

const toPct = (xp: number, xpToNext: number): number => {
  if (!Number.isFinite(xp) || !Number.isFinite(xpToNext) || xpToNext <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((xp / xpToNext) * 100)));
};

const ProfileHud = ({
  userName,
  title = "Aventurier",
  level,
  xp,
  xpToNext,
  avatarUrl,
  avatarChoices = DEFAULT_AVATARS,
  onAvatarChange,
  className = "",
}: ProfileHudProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const initialAvatar = avatarUrl || (avatarChoices[0]?.url ?? "/avatar.png");
  const [pendingAvatar, setPendingAvatar] = useState<string>(initialAvatar);
  const currentAvatar = avatarUrl ?? pendingAvatar;

  const pct = useMemo(() => toPct(xp, xpToNext), [xp, xpToNext]);

  const levelBadge = useMemo(() => getBadgeForLevel(level), [level]);

  const handleOpenEdit = () => {
    setPendingAvatar(currentAvatar);
    setIsEditing(true);
  };
  const handleCancelEdit = () => setIsEditing(false);
  const handleConfirmEdit = () => {
    const chosen = avatarChoices.find((a) => a.url === pendingAvatar);
    if (chosen) onAvatarChange?.(chosen);
    setIsEditing(false);
  };

  return (
    <aside
      className={[
        "w-full rounded-2xl shrink-0 h-full sticky",
        "bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-violet-900/25 backdrop-blur text-white flex flex-col",
        "border-l border-blue-500/30 shadow-[0_20px_50px_rgba(59,130,246,0.15)]",
        className,
      ].join(" ")}
    >
      {/* Profil + avatar */}
      <div className="p-6 border-b border-yellow-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentAvatar}
                alt={`Avatar de ${userName}`}
                className="w-14 h-14 rounded-full ring-2 ring-blue-400/70"
              />
              <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-gray-900" />
            </div>
            <div>
              <div className="font-semibold text-lg text-blue-50">{userName}</div>
              <div className="text-xs text-amber-400 uppercase tracking-wide">{title}</div>
            </div>
          </div>

          {/* Edition avatar */}
          {!isEditing ? (
            <button
              onClick={handleOpenEdit}
              className="p-2 rounded-md border border-blue-500/30 text-blue-200/80 hover:text-blue-100 hover:border-blue-300/60 transition"
              title="Modifier l'avatar"
            >
              <Pencil size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmEdit}
                className="p-2 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 transition"
                title="Valider"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 rounded-md bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30 transition"
                title="Annuler"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Galerie avatars (visible en mode édition) */}
        {isEditing && (
          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-thin">
            {avatarChoices.map((a) => {
              const isActive = pendingAvatar === a.url;
              return (
                <button
                  key={a.id}
                  onClick={() => setPendingAvatar(a.url)}
                  className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition ${
                    isActive ? "ring-yellow-400" : "ring-transparent hover:ring-yellow-200"
                  }`}
                  title={a.label || a.id}
                >
                  <img src={a.url} alt={a.label || a.id} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Niveau avec icône */}
      <div className="p-6">
        <div className="rounded-xl border border-blue-500/30 bg-black/40 p-4 shadow-inner flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-200/70">Niveau</div>
            <div className="mt-1 text-2xl font-bold text-amber-400">{level}</div>
          </div>
          <div className="text-3xl" title={getLevelIcon(level).label}>
            {getLevelIcon(level).icon}
          </div>
        </div>
      </div>

      {/* Progression XP */}
      <div className="px-6">
        <div className="rounded-xl border border-blue-500/30 bg-black/40 p-4 shadow-inner">
          <div className="flex items-center justify-between text-xs text-blue-200/70">
            <span>Progression</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-blue-200/60">
            {xp} / {xpToNext} XP
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-6 mt-6">
        <div className="rounded-xl border border-blue-500/30 bg-black/40 p-4 shadow-inner">
          <div className="text-xs text-blue-200/70 mb-2">Badges</div>
          <div className="flex flex-col gap-3">
            <img src={levelBadge.image} alt={`Badge ${levelBadge.title}`} className="w-12 h-12 rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProfileHud;
