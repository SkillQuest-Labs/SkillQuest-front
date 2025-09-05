import badgeApprenti from "@/shared/lib/badges/badge-apprenti.png";
import badgeIntermediaire from "@/shared/lib/badges/badge-intermediare.png";
import badgeExpert from "@/shared/lib/badges/badge-expert.png";
import badgeMentor from "@/shared/lib/badges/badge-mentor.png";

// ---- Types ----
export type UserClass = "Apprenti" | "Intermédiaire" | "Expert" | "Mentor";

export interface ProgressionResult {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalXp: number;
  userClass: UserClass;
  badge: string;
  nextClass?: UserClass;
  isClassChange: boolean;
}

export function xpForLevel(level: number): number {
  const base = 100;
  return base * level ** 2;
}

// ---- Paliers de classe (à ajuster librement) ----
const CLASS_THRESHOLDS: { level: number; userClass: UserClass; badge: string }[] = [
  { level: 1, userClass: "Apprenti", badge: badgeApprenti },
  { level: 10, userClass: "Intermédiaire", badge: badgeIntermediaire },
  { level: 20, userClass: "Expert", badge: badgeExpert },
  { level: 30, userClass: "Mentor", badge: badgeMentor },
];

// (optionnel) thèmes HUD par classe
export function getClassTheme(cls: UserClass) {
  switch (cls) {
    case "Apprenti":
      return { ring: "border-blue-400/40", chip: "bg-blue-600/40" };
    case "Intermédiaire":
      return { ring: "border-emerald-400/40", chip: "bg-emerald-600/40" };
    case "Expert":
      return { ring: "border-violet-400/40", chip: "bg-violet-600/40" };
    case "Mentor":
      return { ring: "border-amber-400/40", chip: "bg-amber-600/40" };
  }
}

// ---- Calcul principal ----
export function getProgression(totalXp: number): ProgressionResult {
  let level = 1;
  let nextLevelXp = xpForLevel(level);

  while (totalXp >= nextLevelXp) {
    level++;
    nextLevelXp = xpForLevel(level);
  }

  // Classe actuelle + badge
  let userClass: UserClass = "Apprenti";
  let badge = "/badges/badge-apprenti.png";
  for (const t of CLASS_THRESHOLDS) {
    if (level >= t.level) {
      userClass = t.userClass;
      badge = t.badge;
    }
  }

  // Prochaine classe (s'il y en a une)
  const nextClass = CLASS_THRESHOLDS.find((t) => t.level > level)?.userClass;

  // On déclenche une anim si on tombe pile sur un palier (10/20/30…)
  const isClassChange = CLASS_THRESHOLDS.some((t) => t.level === level);

  return {
    level,
    currentXp: totalXp,
    nextLevelXp,
    totalXp,
    userClass,
    badge,
    nextClass,
    isClassChange,
  };
}
