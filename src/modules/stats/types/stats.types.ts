import type { LucideIcon } from "lucide-react";

export interface ExperienceMetric {
  skillId: string;
  skillName: string;
  totalXp: number;
  completedQuests: number;
  averageQuestXp: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  color: string;
}

export type LevelProgression = {
  level: number;
  xpInLevel: number; // XP accumulated in this level only
  totalXpAtLevel: number; // Player's total XP up to this level
  xpRequired: number; // XP required to complete this level
  isCurrentLevel: boolean; // true if this is the player's current level
};

export type XpThreshold = {
  level: number;
  xpRequired: number;
  xpCumulative: number;
};

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
}

export interface SkillRadarData {
  skillId: string;
  skillName: string;
  masteryLevel: number; // 0-100
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

export type StatsCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "orange" | "red" | "yellow";
  progress?: {
    current: number;
    max: number;
    label?: string;
  };
  change?: {
    value: string;
    label: string;
    positive?: boolean;
  };
  badge?: {
    text: string;
    variant: "new" | "hot" | "rare" | "legendary";
  };
  className?: string;
  onClick?: () => void;
};
