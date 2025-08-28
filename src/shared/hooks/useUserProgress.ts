import { useMemo } from "react";
import { getLevelFromXp } from "@/shared/lib/xp";
import { computeTotalXpFromSkills } from "@/shared/lib/xpQuest";
import { useGetSkills } from "@/shared/services/skill/api-skill";

export function useUserProgress(userId: string) {
  const { skills } = useGetSkills(userId);

  const totalXp = useMemo(() => {
    if (!Array.isArray(skills)) return 0;
    return computeTotalXpFromSkills(skills);
  }, [skills]);

  const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);

  return {
    level,
    xpUser: currentXp,   // XP total courant (on l’affiche tel quel)
    xpMax: nextLevelXp,  // Seuil global du prochain niveau
    totalXp,
  };
}
