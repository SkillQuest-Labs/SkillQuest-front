import type { ChartData, UserStats, QuestCompletionMetric, SkillRadarData } from "../types/stats.types";

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

// Données factices pour le radar chart des compétences
export const mockSkillRadarMetrics: SkillRadarData[] = [
  {
    skillId: "1",
    skillName: "JavaScript",
    masteryLevel: 85,
    maxLevel: 100,
    color: "#F7DF1E",
    description: "Langage de programmation web dynamique",
  },
  {
    skillId: "2",
    skillName: "React",
    masteryLevel: 78,
    maxLevel: 100,
    color: "#61DAFB",
    description: "Bibliothèque pour interfaces utilisateur",
  },
  {
    skillId: "3",
    skillName: "TypeScript",
    masteryLevel: 72,
    maxLevel: 100,
    color: "#3178C6",
    description: "JavaScript avec typage statique",
  },
  {
    skillId: "4",
    skillName: "CSS",
    masteryLevel: 90,
    maxLevel: 100,
    color: "#1572B6",
    description: "Feuilles de style en cascade",
  },
  {
    skillId: "5",
    skillName: "Node.js",
    masteryLevel: 65,
    maxLevel: 100,
    color: "#339933",
    description: "Runtime JavaScript côté serveur",
  },
  {
    skillId: "6",
    skillName: "Git",
    masteryLevel: 88,
    maxLevel: 100,
    color: "#F05032",
    description: "Système de contrôle de version",
  },
  {
    skillId: "7",
    skillName: "Docker",
    masteryLevel: 55,
    maxLevel: 100,
    color: "#2496ED",
    description: "Plateforme de conteneurisation",
  },
  {
    skillId: "8",
    skillName: "MongoDB",
    masteryLevel: 68,
    maxLevel: 100,
    color: "#47A248",
    description: "Base de données NoSQL",
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
  skillRadarMetrics: mockSkillRadarMetrics,
};
