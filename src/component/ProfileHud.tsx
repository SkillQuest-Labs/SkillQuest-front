import { Check, Pencil, X, ChevronUp } from "lucide-react";
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
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
};

const DEFAULT_AVATARS: AvatarChoice[] = [
  {
    id: "knight",
    url: "https://res.cloudinary.com/dozh5sfjt/image/upload/v1758494622/profile3_b8f3v8.jpg",
    label: "Chevalier",
  },
  {
    id: "mage",
    url: "https://res.cloudinary.com/dozh5sfjt/image/upload/v1758483178/profile2_yqyogh.jpg",
    label: "Mage",
  },
  {
    id: "archer",
    url: "https://res.cloudinary.com/dozh5sfjt/image/upload/v1758483177/profile1_gx2o4y.jpg",
    label: "Archer",
  },
  {
    id: "robot",
    url: "https://res.cloudinary.com/dozh5sfjt/image/upload/v1758483177/profile4_tjjszp.jpg",
    label: "Robot",
  },
  {
    id: "avatar",
    url: "https://res.cloudinary.com/dozh5sfjt/image/upload/v1758483177/profile_xtvhcy.jpg",
    label: "Avatar",
  },
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
  if (level >= 30) return { image: badgeMentor, title: "Érudit" };
  if (level >= 20) return { image: badgeExpert, title: "Prêtre" };
  if (level >= 10) return { image: badgeIntermediaire, title: "Scribe" };
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
  isCollapsible = false,
  defaultExpanded = false,
}: ProfileHudProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
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

  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  // Si le composant n'est pas collapsible, afficher la version originale
  if (!isCollapsible) {
    return (
      <aside
        className={[
          "w-72 shrink-0 h-full sticky",
          "bg-gradient-to-br from-slate-900/95 via-blue-900/30 to-violet-900/25 backdrop-blur text-white flex flex-col",
          "border-l border-blue-500/30 shadow-[0_20px_50px_rgba(59,130,246,0.15)]",
          className,
        ].join(" ")}
      >
        {/* Version originale complète */}
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
              {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
            </div>
          </div>
        </div>
        <div className="px-6 mt-6">
          <div className="rounded-xl border border-blue-500/30 bg-black/40 p-4 shadow-inner">
            <div className="text-xs text-blue-200/70 mb-2">Badges</div>
            <div className="flex flex-col gap-3">
              <img
                src={levelBadge.image}
                alt={`Badge ${levelBadge.title}`}
                className="w-12 h-12 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Version collapsible inspirée de l'image
  return (
    <div className={`relative ${className}`}>
      {/* État replié - Design inspiré de l'image */}
      <div
        className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 cursor-pointer ${
          isExpanded ? "rounded-t-none" : ""
        }`}
        onClick={toggleExpanded}
      >
        {/* Avatar avec bordure bleue comme dans l'image */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
          <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
        </div>

        {/* Informations utilisateur */}
        <div className="flex flex-col gap-2 min-w-[200px]">
          {/* Nom et rôle */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{userName}</h3>
            <div className="bg-blue-600/80 px-3 py-1 rounded-full border border-blue-400/40">
              <span className="text-sm font-semibold text-white">{title}</span>
            </div>
          </div>

          {/* Barre de progression avec gradient orange-rouge comme dans l'image */}
          <div className="relative">
            <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/40">
              <div
                className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs font-medium text-slate-300">
              <span>LVL {level}</span>
              <span>
                {xp} / {xpToNext} XP
              </span>
            </div>
          </div>
        </div>

        {/* Bouton de toggle */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700/60 hover:bg-slate-600/60 transition-all duration-300 hover:scale-110">
          <div className={`transition-transform duration-300 ease-in-out ${isExpanded ? "rotate-180" : "rotate-0"}`}>
            <ChevronUp className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>

      {/* État déplié */}
      <div
        className={`absolute bottom-full left-0 right-0 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border border-slate-600/30 border-b-0 rounded-t-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 ease-in-out transform ${
          isExpanded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Section Avatar et édition */}
          <div
            className={`space-y-3 transition-all duration-700 ease-out ${
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: isExpanded ? "100ms" : "0ms" }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-300">Photo de profil</h4>
              {!isEditing ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit();
                  }}
                  className="p-2 rounded-md border border-blue-500/30 text-blue-200/80 hover:text-blue-100 hover:border-blue-300/60 transition"
                  title="Modifier l'avatar"
                >
                  <Pencil size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmEdit();
                    }}
                    className="p-2 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 transition"
                    title="Valider"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="p-2 rounded-md bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30 transition"
                    title="Annuler"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Avatar actuel */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400/60">
                  <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">{userName}</div>
                <div className="text-xs text-slate-400">{title}</div>
              </div>
            </div>

            {/* Galerie avatars (visible en mode édition) */}
            {isEditing && (
              <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                {avatarChoices.map((a) => {
                  const isActive = pendingAvatar === a.url;
                  return (
                    <button
                      key={a.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingAvatar(a.url);
                      }}
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

          {/* Section Niveau détaillé */}
          <div
            className={`space-y-3 transition-all duration-700 ease-out ${
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: isExpanded ? "200ms" : "0ms" }}
          >
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-400 text-xs">Niveau actuel</div>
                  <div className="text-white font-bold text-2xl">{level}</div>
                </div>
                <div className="text-3xl" title={getLevelIcon(level).label}>
                  {getLevelIcon(level).icon}
                </div>
              </div>
            </div>
          </div>

          {/* Section Progression détaillée */}
          <div
            className={`space-y-3 transition-all duration-700 ease-out ${
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: isExpanded ? "300ms" : "0ms" }}
          >
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/40">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Progression</span>
                <span>{pct}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-700/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-slate-400 text-center">
                {xp.toLocaleString()} / {xpToNext.toLocaleString()} XP
              </div>
            </div>
          </div>

          {/* Section Badges */}
          <div
            className={`space-y-3 transition-all duration-700 ease-out ${
              isExpanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: isExpanded ? "400ms" : "0ms" }}
          >
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/40">
              <div className="flex items-center gap-3">
                <img
                  src={levelBadge.image}
                  alt={`Badge ${levelBadge.title}`}
                  className="w-12 h-12 rounded-lg shadow-lg"
                />
                <div>
                  <div className="text-white font-medium">{levelBadge.title}</div>
                  <div className="text-xs text-slate-400">Badge de niveau</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHud;
