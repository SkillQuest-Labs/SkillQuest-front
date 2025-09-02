import type { LevelProgression, XpThreshold } from "../../../types/stats.types";

type BuildLevelProgressDataProps = {
  userTotalXp: number;
};

/* 
  xpRequired = XP needed to reach the next level from the current level
  xpCumulative = Total XP needed to reach this level from level 0
*/
export const xpThresholds: XpThreshold[] = [
  { level: 1, xpRequired: 100, xpCumulative: 100 },
  { level: 2, xpRequired: 250, xpCumulative: 350 },
  { level: 3, xpRequired: 450, xpCumulative: 800 },
  { level: 4, xpRequired: 700, xpCumulative: 1500 },
  { level: 5, xpRequired: 1000, xpCumulative: 3000 },
  { level: 6, xpRequired: 1350, xpCumulative: 3850 },
  { level: 7, xpRequired: 1750, xpCumulative: 5600 },
  { level: 8, xpRequired: 2200, xpCumulative: 7800 },
  { level: 9, xpRequired: 2700, xpCumulative: 10500 },
  { level: 10, xpRequired: 3250, xpCumulative: 13750 },
];

export const buildLevelProgressionData = ({ userTotalXp }: BuildLevelProgressDataProps) => {
  const progression: LevelProgression[] = [];

  for (let i = 0; i < xpThresholds.length; i++) {
    const t = xpThresholds[i];
    const prevCumulative = i === 0 ? 0 : xpThresholds[i - 1].xpCumulative;

    const xpInLevel = Math.min(userTotalXp - prevCumulative, t.xpRequired);
    const totalXpAtLevel = Math.min(userTotalXp, t.xpCumulative);
    const isCurrentLevel = userTotalXp <= t.xpCumulative && userTotalXp > prevCumulative;

    progression.push({
      level: t.level,
      xpInLevel: xpInLevel > 0 ? xpInLevel : 0,
      totalXpAtLevel,
      xpRequired: t.xpRequired,
      isCurrentLevel,
    });

    // If the user has not reached this level, we can stop
    if (userTotalXp <= t.xpCumulative) break;
  }

  return progression;
};
