import type { UserStats } from "@/shared/services/user/api-user.type";
import type { Skill } from "@/shared/types/skill.type";
import type { UserProgress } from "@/shared/types/user.type";

type ComputeUserProgress = {
  skills: Skill[];
  userStats?: UserStats;
};

export const useComputeUserProgress = ({ skills, userStats }: ComputeUserProgress): UserProgress => {
  if (!userStats) {
    return {
      totalXp: 0,
      totalQuestCompleted: 0,
      totalSkillCompleted: 0,
      userCurrentLevel: 0,
      xpThreshold: 0,
      xpToNextLevel: 0,
    };
  }
  const totalQuestCompleted = skills.reduce((acc, skill) => acc + (skill.completedQuests || 0), 0);
  const totalSkillCompleted = skills.filter((skill) => skill.status === "COMPLETED").length;

  return {
    totalXp: userStats.totalXP,
    xpThreshold: userStats.xpTheshold,
    xpToNextLevel: userStats.xpToNextLevel,
    userCurrentLevel: userStats.level,
    totalQuestCompleted,
    totalSkillCompleted,
  };
};
