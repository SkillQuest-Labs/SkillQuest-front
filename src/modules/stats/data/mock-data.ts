import type {
  ChartData,
  ExperienceMetric,
  LevelProgression,
  XpThreshold,
  UserStats,
  QuestCompletionMetric,
  SkillRadarData,
} from "../types/stats.types";

// Données factices pour les métriques d'expérience par skill
export const mockExperienceMetrics: ExperienceMetric[] = [
  {
    skillId: "1",
    skillName: "JavaScript",
    totalXp: 2850,
    completedQuests: 12,
    averageQuestXp: 237,
    difficulty: "MEDIUM",
    color: "#F7DF1E",
  },
  {
    skillId: "2",
    skillName: "React",
    totalXp: 2200,
    completedQuests: 8,
    averageQuestXp: 275,
    difficulty: "HARD",
    color: "#61DAFB",
  },
  {
    skillId: "3",
    skillName: "TypeScript",
    totalXp: 1800,
    completedQuests: 6,
    averageQuestXp: 300,
    difficulty: "HARD",
    color: "#3178C6",
  },
  {
    skillId: "4",
    skillName: "CSS",
    totalXp: 1650,
    completedQuests: 15,
    averageQuestXp: 110,
    difficulty: "EASY",
    color: "#1572B6",
  },
  {
    skillId: "5",
    skillName: "Node.js",
    totalXp: 1400,
    completedQuests: 5,
    averageQuestXp: 280,
    difficulty: "MEDIUM",
    color: "#339933",
  },
  {
    skillId: "6",
    skillName: "Git",
    totalXp: 950,
    completedQuests: 10,
    averageQuestXp: 95,
    difficulty: "EASY",
    color: "#F05032",
  },
];

// Données factices pour la progression des niveaux dans le temps
export const mockLevelProgression: LevelProgression[] = [
  { level: 1, xpRequired: 100, xpCurrent: 100, date: "2024-01-01", isCurrentLevel: false },
  { level: 2, xpRequired: 250, xpCurrent: 350, date: "2024-01-15", isCurrentLevel: false },
  { level: 3, xpRequired: 450, xpCurrent: 800, date: "2024-02-01", isCurrentLevel: false },
  { level: 4, xpRequired: 700, xpCurrent: 1500, date: "2024-02-20", isCurrentLevel: false },
  { level: 5, xpRequired: 1000, xpCurrent: 2500, date: "2024-03-10", isCurrentLevel: false },
  { level: 6, xpRequired: 1350, xpCurrent: 3850, date: "2024-03-25", isCurrentLevel: false },
  { level: 7, xpRequired: 1750, xpCurrent: 5600, date: "2024-04-12", isCurrentLevel: false },
  { level: 8, xpRequired: 2200, xpCurrent: 7800, date: "2024-05-01", isCurrentLevel: false },
  { level: 9, xpRequired: 2700, xpCurrent: 10500, date: "2024-05-20", isCurrentLevel: true },
];

// Seuils XP pour chaque niveau
export const mockXpThresholds: XpThreshold[] = [
  { level: 1, xpRequired: 100, xpCumulative: 100 },
  { level: 2, xpRequired: 250, xpCumulative: 350 },
  { level: 3, xpRequired: 450, xpCumulative: 800 },
  { level: 4, xpRequired: 700, xpCumulative: 1500 },
  { level: 5, xpRequired: 1000, xpCumulative: 2500 },
  { level: 6, xpRequired: 1350, xpCumulative: 3850 },
  { level: 7, xpRequired: 1750, xpCumulative: 5600 },
  { level: 8, xpRequired: 2200, xpCumulative: 7800 },
  { level: 9, xpRequired: 2700, xpCumulative: 10500 },
  { level: 10, xpRequired: 3250, xpCumulative: 13750 },
];

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
  experienceMetrics: mockExperienceMetrics,
  levelProgression: mockLevelProgression,
  xpThresholds: mockXpThresholds,
  userStats: mockUserStats,
  questCompletionMetrics: mockQuestCompletionMetrics,
  skillRadarMetrics: mockSkillRadarMetrics,
};
