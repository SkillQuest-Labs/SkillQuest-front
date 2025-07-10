import type { SkillStatus, Skill } from "@/shared/types/skill.type";

export type CreateSkillInput = Skill;

export type CreateSkillResponse = Skill & {
  id: string;
  status: SkillStatus;
  completionTime: null;
  userId: string;
};
