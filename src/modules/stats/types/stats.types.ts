export interface ExperienceMetric {
  skillId: string;
  skillName: string;
  totalXp: number;
  completedQuests: number;
  averageQuestXp: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  color: string;
}

export interface LevelProgression {
  level: number;
  xpRequired: number;
  xpCurrent: number;
  date: string;
  isCurrentLevel: boolean;
}

export interface XpThreshold {
  level: number;
  xpRequired: number;
  xpCumulative: number;
}

export interface UserStats {
  totalXp: number;
  currentLevel: number;
  nextLevelXp: number;
  skillsCompleted: number;
  questsCompleted: number;
  averageSessionTime: number;
}

export interface QuestCompletionMetric {
  skillId: string;
  skillName: string;
  completedQuests: number;
  remainingQuests: number;
  totalQuests: number;
  completionRate: number;
  color: string;
}

export interface SkillRadarData {
  skillId: string;
  skillName: string;
  masteryLevel: number; // 0-100
  maxLevel: number;
  color: string;
  description?: string;
}

export interface ChartData {
  experienceMetrics: ExperienceMetric[];
  levelProgression: LevelProgression[];
  xpThresholds: XpThreshold[];
  userStats: UserStats;
  questCompletionMetrics: QuestCompletionMetric[];
  skillRadarMetrics: SkillRadarData[];
}
