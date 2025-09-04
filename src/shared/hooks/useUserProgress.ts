import { useMemo } from "react";
import { getProgression } from "@/shared/lib/progression";
import { computeTotalXpFromSkills } from "@/shared/lib/xpQuest"; // <- déjà vu (somme XP des quêtes DONE)
import { useGetSkills } from "@/shared/services/skill/api-skill";

export function useUserProgress(userId: string) {
  const { skills } = useGetSkills(userId);

  const totalXp = useMemo(() => {
    if (!Array.isArray(skills)) return 0;
    return computeTotalXpFromSkills(skills); // somme des quêtes DONE: EASY=100, MEDIUM=200, HARD=400
  }, [skills]);

  const {
    level,
    currentXp,
    nextLevelXp,
    userClass,
    badge,
    nextClass,
    isClassChange,
  } = getProgression(totalXp);

  return {
    level,
    xpUser: currentXp,
    xpMax: nextLevelXp,
    totalXp,
    userClass,
    badge,
    nextClass,
    isClassChange,
  };
}
