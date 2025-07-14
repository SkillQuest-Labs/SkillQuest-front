import type { QuestDifficulty } from "./quest.type";

export type SkillStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "NOT_STARTED";

export type Skill = {
  id?: string;
  userId: string;
  status?: SkillStatus;
  completionTime?: null;
  title: string;
  description?: string;
  difficulty: QuestDifficulty;
};
