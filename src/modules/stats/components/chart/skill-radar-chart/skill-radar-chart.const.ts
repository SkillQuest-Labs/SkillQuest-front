import type { SkillRadarData } from "@/modules/stats/types/stats.types";
import type { Skill } from "@/shared/types/skill.type";

export const buildSkillRadarData = (skills: Skill[]): SkillRadarData[] => {
  if (skills.length === 0) return [];

  return skills.map((skill) => {
    const totalQuests = skill.totalQuests ?? 0;
    const completedQuests = skill.completedQuests ?? 0;

    const masteryLevel = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

    return {
      skillId: skill.id || "",
      skillName: skill.title,
      masteryLevel: Math.min(Math.round(masteryLevel), 100),
      color: skill.color || "#888888",
      description: skill.description || "",
    };
  });
};
