import { useMemo } from "react";
import type { Skill } from "@/shared/types/skill.type";
import { SKILL_CARD_CONSTANTS } from "../skills.const";

export const useSkillCardImage = (skill: Skill) => {
  const imageStyle = useMemo(() => {
    const imageUrl = skill.imageUrl || SKILL_CARD_CONSTANTS.DEFAULT_IMAGE;

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }, [skill.imageUrl]);

  const hasImage = useMemo(() => {
    return Boolean(skill.imageUrl);
  }, [skill.imageUrl]);

  return {
    imageStyle,
    hasImage,
  };
};
