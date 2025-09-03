import type { ChartData, UserStats } from "../types/stats.types";

export const mockUserStats: UserStats = {
  totalXp: 10850,
  currentLevel: 9,
  nextLevelXp: 13750,
  skillsCompleted: 6,
  questsCompleted: 56,
  averageSessionTime: 45,
};

export const mockChartData: ChartData = {
  experienceMetrics: [],
  levelProgression: [],
  xpThresholds: [],
  userStats: mockUserStats,
  questCompletionMetrics: [],
  skillRadarMetrics: [],
};
