export type SkillDifficulty = "easy" | "medium" | "hard";

export type SkillStatus = "draft" | "in_progress" | "not_started" | "finished";

export type Skill = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: SkillDifficulty;
  status: SkillStatus;
  createdAt: string;
  image?: string;
};
