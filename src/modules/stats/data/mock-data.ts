import type { ChartData, UserStats, QuestCompletionMetric } from "../types/stats.types";

// Données factices pour les quêtes complétées par skill
export const mockQuestCompletionMetrics: QuestCompletionMetric[] = [
  {
    skillId: "1",
    skillName: "JavaScript",
    completedQuests: 12,
    remainingQuests: 8,
    totalQuests: 20,
    completionRate: 60,
    color: "#F7DF1E",
  },
  {
    skillId: "2",
    skillName: "React",
    completedQuests: 8,
    remainingQuests: 7,
    totalQuests: 15,
    completionRate: 53.3,
    color: "#61DAFB",
  },
  {
    skillId: "3",
    skillName: "TypeScript",
    completedQuests: 6,
    remainingQuests: 6,
    totalQuests: 12,
    completionRate: 50,
    color: "#3178C6",
  },
  {
    skillId: "4",
    skillName: "CSS",
    completedQuests: 15,
    remainingQuests: 3,
    totalQuests: 18,
    completionRate: 83.3,
    color: "#1572B6",
  },
  {
    skillId: "5",
    skillName: "Node.js",
    completedQuests: 5,
    remainingQuests: 10,
    totalQuests: 15,
    completionRate: 33.3,
    color: "#339933",
  },
  {
    skillId: "6",
    skillName: "Git",
    completedQuests: 10,
    remainingQuests: 2,
    totalQuests: 12,
    completionRate: 83.3,
    color: "#F05032",
  },
];

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
  experienceMetrics: [],
  levelProgression: [],
  xpThresholds: [],
  userStats: mockUserStats,
  questCompletionMetrics: mockQuestCompletionMetrics,
  skillRadarMetrics: [],
};
