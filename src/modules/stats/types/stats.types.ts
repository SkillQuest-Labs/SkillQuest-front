import type { Skill } from "@/shared/types/skill.type";
import type { LucideIcon } from "lucide-react";

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
