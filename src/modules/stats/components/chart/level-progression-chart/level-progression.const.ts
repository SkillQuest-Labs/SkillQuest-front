import type { LevelProgression, XpThreshold } from "../../../types/stats.types";

type BuildLevelProgressDataProps = {
  userTotalXp: number;
  maxLevel?: number;
};

/* 
  xpRequired = XP needed to reach the next level from the current level
  xpCumulative = Total XP needed to reach this level from level 0
*/

export const generateXpThresholds = (maxLevel: number): XpThreshold[] => {
  const thresholds: XpThreshold[] = [];
  let cumulative = 0;

  for (let level = 1; level <= maxLevel; level++) {
    // choisir l'exponent en fonction du palier
    let alpha = 1.5;
    if (level > 5 && level <= 10) alpha = 2;
    else if (level > 10) alpha = 2.5;

    const baseXp = 100;
    const xpRequired = Math.round(baseXp * Math.pow(level, alpha));

    cumulative += xpRequired;
    thresholds.push({ level, xpRequired, xpCumulative: cumulative });
  }

  return thresholds;
};

// export const xpThresholds: XpThreshold[] = [
//   { level: 1, xpRequired: 100, xpCumulative: 100 },
//   { level: 2, xpRequired: 250, xpCumulative: 350 },
//   { level: 3, xpRequired: 450, xpCumulative: 800 },
//   { level: 4, xpRequired: 700, xpCumulative: 1500 },
//   { level: 5, xpRequired: 1000, xpCumulative: 3000 },
//   { level: 6, xpRequired: 1350, xpCumulative: 3850 },
//   { level: 7, xpRequired: 1750, xpCumulative: 5600 },
//   { level: 8, xpRequired: 2200, xpCumulative: 7800 },
//   { level: 9, xpRequired: 2700, xpCumulative: 10500 },
//   { level: 10, xpRequired: 3250, xpCumulative: 13750 },
// ];

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
