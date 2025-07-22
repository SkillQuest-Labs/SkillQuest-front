import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { isQuestNode, isSkillNode } from "../../canvas.const";
import type { GeminiContext, QuestAiType, SkillAiType } from "@/shared/types/ai/ai.type";

export const useGeminiContext = (): GeminiContext => {
  const nodes = useCanvasStore((s) => s.nodes);
  const skillNode = nodes.find(isSkillNode);

  const existingQuests: QuestAiType[] = nodes.filter(isQuestNode).map((node) => ({
    title: node.data.title,
    description: node.data.description,
    xp: node.data.xp,
    difficulty: node.data.difficulty,
    prerequisites: [],
  }));

  const skillForAi: SkillAiType = {
    ...skillNode?.data.config,
    level: "Débutant",
    goal: "Atteindre la maîtrise de ce skill via un projet concret",
  };

  return {
    skill: skillForAi && {
      title: skillForAi.title,
      description: skillForAi.description,
      difficulty: skillForAi.difficulty,
      level: skillForAi.level ?? "Débutant",
      goal: skillForAi.goal ?? "Atteindre la maîtrise de ce skill via un projet concret",
    },
    existingQuests,
    format: {
      title: "string",
      description: "string",
      xp: "number",
      difficulty: "EASY|MEDIUM|HARD",
      prerequisites: "string[] (optional)",
    },
    instruction:
      "Génère 3 quêtes originales, progressives (de facile à difficile), " +
      "en respectant l'objectif final et sans doublons avec les quêtes existantes." +
      " Chaque quête doit être unique et apporter une valeur ajoutée à l'apprentissage du skill." +
      "\n\nCritères de qualité :" +
      "\n- Chaque quête doit avoir un objectif concret et mesurable" +
      "\n- Les quêtes doivent former une progression logique (bases → intermédiaire → avancé)" +
      "\n- Inclure des éléments pratiques et applicables dans le monde réel" +
      "\n- Éviter les quêtes trop théoriques ou abstraites" +
      "\n- S'assurer que chaque quête développe des compétences spécifiques et identifiables" +
      "\n- Proposer des défis stimulants mais réalisables pour le niveau indiqué",
  };
};
