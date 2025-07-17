import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { isQuestNode, isSkillNode } from "../../canvas.const";

export const useGeminiContext = () => {
  // Récupère tous les nodes du canvas
  const nodes = useCanvasStore((state) => state.nodes);

  // Récupère le skill courant (le node de type skill)
  const skillNode = nodes.find(isSkillNode);

  // Récupère les quêtes existantes (nodes de type quest)
  const existingQuests = nodes.filter(isQuestNode).map((node) => ({
    title: node.data.title,
    description: node.data.description,
    xp: node.data.xp,
    difficulty: node.data.difficulty,
  }));

  // Structure le contexte pour Gemini
  return {
    skill: skillNode
      ? {
          title: skillNode.data.config.title,
          description: skillNode.data.config.description,
          difficulty: skillNode.data.config.difficulty,
        }
      : null,
    existingQuests,
    format: {
      title: "string",
      description: "string",
      xp: "number",
      difficulty: "EASY|MEDIUM|HARD",
    },
    instruction:
      "Génère 3 nouvelles quêtes originales et progressives pour ce skill, en évitant les doublons avec les quêtes existantes.",
  };
};
