import { useMemo, useCallback } from "react";
import type { Skill } from "@/shared/types/skill.type";
import { statusLabels } from "../skills.const";

export const useSkillCardOptimization = (skill: Skill) => {
  // Mémorisation des calculs coûteux
  const skillId = useMemo(() => {
    return skill.skillId || skill.id || "";
  }, [skill.skillId, skill.id]);

  const statusLabel = useMemo(() => {
    return statusLabels[skill.status];
  }, [skill.status]);

  const hasDescription = useMemo(() => {
    return Boolean(skill.description?.trim());
  }, [skill.description]);

  // Callbacks optimisés
  const getSkillUrl = useCallback(() => {
    return `/dashboard/skills/${skillId}`;
  }, [skillId]);

  const getDeleteMessage = useCallback(() => {
    return `Êtes-vous sûr de vouloir supprimer le skill ${skill.title} ? Cette action est irréversible.`;
  }, [skill.title]);

  return {
    skillId,
    statusLabel,
    hasDescription,
    getSkillUrl,
    getDeleteMessage,
  };
};
