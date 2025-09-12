export type SkillStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";

export type SkillDifficulty = "EASY" | "MEDIUM" | "HARD";

export type Skill = {
  id?: string;
  skillId?: string;
  userId?: string;
  status: SkillStatus;
  completionTime?: null;
  title: string;
  description?: string;
  difficulty: SkillDifficulty;
  progressValue?: number;
  imageUrl?: string;
  totalXp?: number;
  totalQuests?: number;
  completedQuests?: number;
  averageQuestXp?: number;
  color?: string;
  createdAt?: string;
};
