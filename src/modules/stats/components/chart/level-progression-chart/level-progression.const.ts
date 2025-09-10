import { generateXpThresholds } from "@/modules/stats/stats.const";
import type { LevelProgression } from "../../../types/stats.types";

type BuildLevelProgressDataProps = {
  userTotalXp: number;
  maxLevel?: number;
};

/* 
  xpRequired = XP needed to reach the next level from the current level
  xpCumulative = Total XP needed to reach this level from level 0
*/

export const buildLevelProgressionData = ({ userTotalXp, maxLevel = 10 }: BuildLevelProgressDataProps) => {
  if (userTotalXp <= 0 || maxLevel <= 0) return [];

  const progression: LevelProgression[] = [];

  const xpThresholds = generateXpThresholds(maxLevel);

  for (let i = 0; i < xpThresholds.length; i++) {
    const t = xpThresholds[i];
    if (t.level > maxLevel) break;

    const prevCumulative = i === 0 ? 0 : xpThresholds[i - 1].xpCumulative;

    // XP gagné dans ce niveau (peut dépasser xpRequired)
    const xpEarnedInLevel = Math.max(userTotalXp - prevCumulative, 0);

    // XP total accumulé jusqu'à ce niveau (limité à l'XP de l'utilisateur)
    const totalXpAtLevel = Math.min(userTotalXp, t.xpCumulative);

    // Surplus éventuel (XP gagné au-delà du requis pour ce niveau)
    const xpSurplus = xpEarnedInLevel - t.xpRequired;

    // Est-ce le niveau actuel ?
    const isCurrentLevel = userTotalXp > prevCumulative && userTotalXp <= t.xpCumulative;

    progression.push({
      level: t.level,
      xpEarnedInLevel,
      totalXpAtLevel,
      xpRequired: t.xpRequired,
      isCurrentLevel,
      extraXP: xpSurplus > 0 ? xpSurplus : 0,
    });
  }

  return progression;
};
