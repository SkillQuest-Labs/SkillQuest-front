import { getUserLevel } from "@/modules/stats/stats.const";
import type { Skill } from "../types/skill.type";

export interface UserProgress {
  totalXp: number;
  totalQuestCompleted: number;
  totalSkillCompleted: number;
  userCurrentLevel: number;
  xpMaxForLevel: number;
}

export function computeUserProgress(skills: Skill[]): UserProgress {
  const totalXp = skills.reduce((acc, skill) => acc + (skill.totalXp || 0), 0);
  const totalQuestCompleted = skills.reduce((acc, skill) => acc + (skill.completedQuests || 0), 0);
  const totalSkillCompleted = skills.filter((skill) => skill.status === "COMPLETED").length;

  const { level: userCurrentLevel, xpMaxForLevel } = getUserLevel(totalXp);

  return {
    totalXp,
    totalQuestCompleted,
    totalSkillCompleted,
    userCurrentLevel,
    xpMaxForLevel,
  };
}
