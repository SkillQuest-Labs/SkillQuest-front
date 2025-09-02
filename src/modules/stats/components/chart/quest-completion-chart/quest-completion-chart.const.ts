import type { Skill } from "@/shared/types/skill.type";

export const buildQuestCompletionData = (skills: Skill[]) => {
  if (skills.length === 0) return [];

  return skills.map((skill) => {
    const totalQuests = skill.totalQuests ?? 0;
    const completedQuests = skill.completedQuests ?? 0;
    const remainingQuests = totalQuests - completedQuests;
    return {
      skillId: skill.id ?? "",
      skillName: skill.title ?? "",
      completedQuests: skill.completedQuests ?? 0,
      remainingQuests: remainingQuests ?? 0,
      totalQuests: skill.totalQuests ?? 0,
    };
  });
};
