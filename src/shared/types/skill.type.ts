export type SkillStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";

export type SkillDifficulty = "EASY" | "MEDIUM" | "HARD" | "ALL";

export type Skill = {
  id?: string;
  userId: string;
  status?: SkillStatus;
  completionTime?: null;
  title: string;
  description?: string;
  difficulty: SkillDifficulty;
};
