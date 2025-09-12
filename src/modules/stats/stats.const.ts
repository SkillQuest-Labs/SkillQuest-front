import type { XpThreshold } from "./types/stats.types";

export const colorVariants = {
  blue: {
    bg: "from-blue-500/20 via-blue-600/10 to-blue-700/20",
    border: "border-blue-400/30",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    iconShadow: "shadow-blue-500/50",
    glow: "shadow-blue-500/20",
    text: "text-blue-400",
  },
  purple: {
    bg: "from-purple-500/20 via-purple-600/10 to-purple-700/20",
    border: "border-purple-400/30",
    iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
    iconShadow: "shadow-purple-500/50",
    glow: "shadow-purple-500/20",
    text: "text-purple-400",
  },
  green: {
    bg: "from-green-500/20 via-green-600/10 to-green-700/20",
    border: "border-green-400/30",
    iconBg: "bg-gradient-to-br from-green-400 to-green-600",
    iconShadow: "shadow-green-500/50",
    glow: "shadow-green-500/20",
    text: "text-green-400",
  },
  orange: {
    bg: "from-orange-500/20 via-orange-600/10 to-orange-700/20",
    border: "border-orange-400/30",
    iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
    iconShadow: "shadow-orange-500/50",
    glow: "shadow-orange-500/20",
    text: "text-orange-400",
  },
  red: {
    bg: "from-red-500/20 via-red-600/10 to-red-700/20",
    border: "border-red-400/30",
    iconBg: "bg-gradient-to-br from-red-400 to-red-600",
    iconShadow: "shadow-red-500/50",
    glow: "shadow-red-500/20",
    text: "text-red-400",
  },
  yellow: {
    bg: "from-yellow-500/20 via-yellow-600/10 to-yellow-700/20",
    border: "border-yellow-400/30",
    iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    iconShadow: "shadow-yellow-500/50",
    glow: "shadow-yellow-500/20",
    text: "text-yellow-400",
  },
};

export const badgeVariants = {
  new: "bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse",
  hot: "bg-gradient-to-r from-red-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold",
  rare: "bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold",
  legendary:
    "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse",
};

export const generateXpThresholds = (maxLevel: number): XpThreshold[] => {
  const thresholds: XpThreshold[] = [];
  let cumulative = 0;

  for (let level = 1; level <= maxLevel; level++) {
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

export const getUserLevel = (currentXp: number, batchSize = 10): { level: number; xpMaxForLevel: number } => {
  let maxLevel = batchSize;
  let level = 0;
  let xpMaxForLevel = 0;

  while (true) {
    const thresholds = generateXpThresholds(maxLevel);

    for (let i = 0; i < thresholds.length; i++) {
      const threshold = thresholds[i];
      const nextThreshold = thresholds[i + 1];

      if (currentXp >= threshold.xpRequired) {
        level = threshold.level;
        xpMaxForLevel = nextThreshold ? nextThreshold.xpRequired : threshold.xpRequired;
      } else {
        // as soon as we find a threshold the user hasn't reached, we return the current level
        return { level, xpMaxForLevel };
      }
    }

    maxLevel += batchSize;
  }
};
