// src/shared/hooks/useUserProgressFromQuests.ts
import { useMemo } from "react";
import { useGetQuests } from "@/shared/services/quest/api-quest";
import type { Quest } from "@/shared/types/quest.type";

const DIFF_TO_XP: Record<NonNullable<Quest["difficulty"]>, number> = {
  EASY: 100,
  MEDIUM: 200,
  HARD: 400,
};

// XP cumulatif requis pour atteindre un niveau L (1→2 = 100, 2→3 = 400, 3→4 = 900, …)
function xpForLevel(level: number) {
  const base = 100;
  return base * level * level;
}

function computeLevel(totalXp: number) {
  let level = 1;
  let nextLevelXp = xpForLevel(level);
  while (totalXp >= nextLevelXp) {
    level++;
    nextLevelXp = xpForLevel(level);
  }
  const prevLevelXp = xpForLevel(level - 1);
  const xpUser = totalXp - prevLevelXp;
  const xpMax = nextLevelXp - prevLevelXp;
  return { level, xpUser, xpMax, totalXp };
}

export function useUserProgressFromQuests(skillId: string) {
  const { quests = [], loading, error } = useGetQuests(skillId);

  const result = useMemo(() => {
    // somme XP des quêtes complétées
    const totalXp = quests
      .filter((q) => q.status === "COMPLETED")
      .reduce((sum, q) => {
        if (typeof q.xp === "number" && q.xp > 0) return sum + q.xp;
        if (q.difficulty) return sum + (DIFF_TO_XP[q.difficulty] ?? 0);
        return sum;
      }, 0);

    return computeLevel(totalXp);
  }, [quests]);

  return { ...result, loading, error };
}
