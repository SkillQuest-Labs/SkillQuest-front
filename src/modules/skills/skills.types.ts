export type SkillDifficulty = "EASY" | "MEDIUM" | "HARD" | "ALL";

export type SkillStatus = "DRAFT" | "IN_PROGRESS" | "NOT_STARTED" | "COMPLETED" | "ALL";

export type SkillSort = "RECENT" | "OLDEST";

export type Skill = {
  id?: string;
  skillId?: string;
  title: string;
  description?: string;
  difficulty: SkillDifficulty;
  status: SkillStatus;
  createdAt?: string;
  image?: string;
  progressValue?: number; // 0 to 100, for the progress bar
};
