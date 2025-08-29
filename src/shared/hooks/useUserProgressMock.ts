import { useMemo } from "react";
import { getLevelFromXp } from "@/shared/lib/xp";
import { computeTotalXpFromSkills } from "@/shared/lib/xpQuest";
import { mockSkills } from "../../mock/mockSkills"; // 🔥 ton fichier de mocks

export function useUserProgressMock() {
  const skills = mockSkills; // données en dur

  const totalXp = useMemo(() => {
    return computeTotalXpFromSkills(skills);
  }, [skills]);

  const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);

  return {
    level,
    xpUser: currentXp,
    xpMax: nextLevelXp,
    totalXp,
  };
}
