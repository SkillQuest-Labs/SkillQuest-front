import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { isQuestNode, isSkillNode } from "../../canvas.const";
import type { GeminiContext, QuestAiType, SkillAiType } from "@/shared/types/ai/ai.type";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";

export const useGeminiContext = (): GeminiContext => {
  const nodes = useCanvasStore((s) => s.nodes);
  const form = useQuestGenerationFormStore((s) => s.form);
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
    questNumber: form.numberOfQuests ?? 4,
    level: form.selfLevel ?? "Débutant",
    goal: form.goal ?? "Atteindre la maîtrise de ce skill via un projet concret",
    description: skillNode?.data.config.description,
    goalDescription: form.goalDescription ?? "Développer des compétences pratiques et théoriques dans ce domaine.",
  };

  const baseInstructions = [
    `Génère ${skillForAi.questNumber} quêtes gamifiées pour le skill '${skillForAi.title}'.`,
    `Objectif final : ${skillForAi.goal}.`,
    `Description de l'objectif : ${skillForAi.goalDescription}.`,
    `Description du skill : ${skillForAi.description}.`,
    `Niveau de base de l'apprenant : ${skillForAi.level}.`,
  ];

  const qualityCriteria = [
    "Objectif concret et mesurable pour chaque quête",
    "Progression pédagogique logique (bases → intermédiaire → avancé)",
    "Chaque quête doit être unique et apporter une valeur ajoutée à l'apprentissage du skill.",
    "Inclure des exercices pratiques applicables dans le monde réel et ressources externes si possible",
    "Éviter les quêtes trop théoriques ou abstraites",
    "Chaque quête développe une compétence identifiable",
    "Proposer des défis stimulants mais réalisables pour le niveau indiqué",
    "Respecter les quêtes existantes si on en a pour éviter les doublons",
    "Utiliser un langage clair et précis pour chaque quête",
    "Forme une progression logique avec des tâches distinctes.",
  ];

  let instruction = [...baseInstructions, "\nCritères de qualité :", ...qualityCriteria.map((c) => `- ${c}`)].join(
    "\n",
  );

  // Optimisation du prompt pour plus de clarté et de concision

  const extras: string[] = [];

  if (form.manualContext && form.contextText?.trim()) {
    instruction = form.contextText.trim();
  } else {
    if (form.styleApprentissage) {
      extras.push(
        form.styleApprentissage === "Equilibré"
          ? "Style d'apprentissage : Équilibré (théoriques et pratiques)"
          : `Style d'apprentissage : ${form.styleApprentissage}`,
      );
    }
    if (form.ambianceQueteStyle) {
      extras.push(`Ambiance des quêtes : ${form.ambianceQueteStyle}`);
    }
    if (form.ressourceType && form.ressourceType.length > 0) {
      extras.push(`Types de ressources : ${form.ressourceType.join(", ")}`);
    }
    if (form.relatedSkill) {
      extras.push(`Compétence connexe : ${form.relatedSkill}`);
    }
    if (extras.length) {
      instruction += "\n\nContexte supplémentaire :\n" + extras.join("\n");
    }
  }

  return {
    skill: skillForAi,
    existingQuests,
    format: {
      title: "string",
      description: "string",
      xp: "number",
      difficulty: "EASY|MEDIUM|HARD",
      prerequisites: "string[] (optional)",
    },
    instruction,
  };
};
