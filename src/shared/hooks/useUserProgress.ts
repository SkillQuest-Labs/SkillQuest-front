import { useMemo } from "react";
import { levelFromTotalXp } from "@/shared/lib/xp";
import { useGetSkills } from "@/shared/services/skill/api-skill";

// Adapte ces fonctions si tes noms de champs diffèrent
function isDone(status: unknown) {
  if (!status) return false;
  const s = String(status).toUpperCase();
  return s === "DONE" || s === "COMPLETED" || s === "FINISHED";
}

function xpOf(skill: any): number {
  if (typeof skill?.xpReward === "number") return skill.xpReward;
  if (typeof skill?.xp === "number") return skill.xp;
  if (typeof skill?.rewardXp === "number") return skill.rewardXp;
  return 0;
}

export function useUserProgress(userId: string) {
  const { skills } = useGetSkills(userId);

  const totalXp = useMemo(() => {
    if (!Array.isArray(skills)) return 0;
    return skills.filter((s) => isDone(s?.status)).reduce((sum, s) => sum + xpOf(s), 0);
  }, [skills]);

  const { level, xp, xpMax } = levelFromTotalXp(totalXp);

  return {
    level,
    xpUser: xp,
    xpMax,
    totalXp,
  };
}
