import type { QuestDifficulty } from "./quest.type";

export type SkillStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";

export type Skill = {
  title: string;
  description?: string;
  difficulty: QuestDifficulty;
  userId: string;
};
