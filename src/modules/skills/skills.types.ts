export enum SkillDifficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export enum SkillStatus {
  Draft = "draft",
  InProgress = "in_progress",
  NotStarted = "not_started",
  Finished = "finished",
}

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
