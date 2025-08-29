import type {
  ChartData,
  UserStats,
} from "../types/stats.types";

// Statistiques utilisateur globales
export const mockUserStats: UserStats = {
  totalXp: 10850,
  currentLevel: 9,
  nextLevelXp: 13750,
  skillsCompleted: 6,
  questsCompleted: 56,
  averageSessionTime: 45, // en minutes
};

// Données complètes pour le graphique
export const mockChartData: ChartData = {
  levelProgression: [],
  xpThresholds: [],
  userStats: mockUserStats,
  questCompletionMetrics: [],
  skillRadarMetrics: [],
  experienceXpMetrics: [],
};
