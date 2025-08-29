import type { Skill } from "@/shared/types/skill.type";

export interface UserStats {
  totalXp: number;
  currentLevel: number;
  nextLevelXp: number;
  skillsCompleted: number;
  questsCompleted: number;
  averageSessionTime: number;
}

export interface ChartData {
  experienceXpMetrics: Skill[];
  levelProgression: [];
  xpThresholds: [];
  userStats: UserStats;
  questCompletionMetrics: [];
  skillRadarMetrics: [];
}
