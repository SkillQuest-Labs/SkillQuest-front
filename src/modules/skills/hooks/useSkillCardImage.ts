import { useMemo } from "react";
import type { Skill } from "@/shared/types/skill.type";
import { getRandomDefaultImage } from "../skills.const";

export const useSkillCardImage = (skill: Skill) => {
  const imageStyle = useMemo(() => {
    const imageUrl = skill.imageUrl || getRandomDefaultImage(skill.skillId || skill.id);

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }, [skill.imageUrl, skill.skillId, skill.id]);

  const hasImage = useMemo(() => {
    return Boolean(skill.imageUrl);
  }, [skill.imageUrl]);

  return {
    imageStyle,
    hasImage,
  };
};
