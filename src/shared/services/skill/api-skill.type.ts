import type { Skill } from "@/shared/types/skill.type";

export type CreateSkillInput = Omit<Skill, "totalQuests">;

export type CreateSkillResponse = Skill;

export type UpdateSkillInput = Partial<Skill>;

export type UpdateSkillResponse = Skill;
