import { useMemo } from "react";
import type { Skill } from "@/shared/types/skill.type";

export const useSkillCardProgress = (skill: Skill) => {
  const progressData = useMemo(() => {
    const progressValue = skill.progressValue;
    const hasProgress = typeof progressValue === "number";

    return {
      progressValue,
      hasProgress,
      progressPercentage: hasProgress ? `${progressValue}%` : "0%",
    };
  }, [skill.progressValue]);

  return progressData;
};
