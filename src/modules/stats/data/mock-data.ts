import type { ChartData, ExperienceMetric, UserStats } from "../types/stats.types";

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

export const mockUserStats: UserStats = {
  totalXp: 10850,
  currentLevel: 9,
  nextLevelXp: 13750,
  skillsCompleted: 6,
  questsCompleted: 56,
  averageSessionTime: 45, // en minutes
};

export const mockChartData: ChartData = {
  experienceMetrics: mockExperienceMetrics,
  levelProgression: [],
  xpThresholds: [],
  userStats: mockUserStats,
  questCompletionMetrics: [],
  skillRadarMetrics: [],
};
