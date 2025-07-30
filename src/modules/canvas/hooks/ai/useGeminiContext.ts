import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { isQuestNode, isSkillNode } from "../../canvas.const";
import type { GeminiContext, QuestAiType } from "@/shared/types/ai/ai.type";
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

  let instruction = "";

  if (form && Object.keys(form).length > 0 && skillNode) {
    if (form.manualContext && form.contextText?.trim()) {
      instruction = form.contextText.trim();
    } else {
      // Build instruction from form data

      const baseInstructions = [
        `Génère ${form.numberOfQuests ?? 4} quêtes gamifiées pour le skill '${skillNode.data.config.title}'.`,
        `Tu dois générer au minimum ${form.numberOfQuests} quêtes. Tu peux en produire plus si cela améliore la progression, mais jamais moins.`,
        `Objectif final : ${form.goal}.`,
        `Description de l'objectif : ${form.goalDescription}.`,
        `Description du skill : ${skillNode.data.config.description}.`,
        `Niveau de base de l'apprenant : ${form.selfLevel}.`,
      ];

      const qualityCriteria = [
        "Objectif concret et mesurable pour chaque quête",
        "Progression pédagogique logique (bases → intermédiaire → avancé)",
        "Chaque quête doit être unique et apporter une valeur ajoutée à l'apprentissage du skill.",
        "Inclure au moins une ressource externe pertinente (tutoriel, article, vidéo, outil) avec lien cliquable dans chaque quête",
        "Éviter les quêtes trop théoriques ou abstraites",
        "Chaque quête développe une compétence identifiable",
        "Proposer des défis stimulants mais réalisables pour le niveau indiqué",
        "Respecter les quêtes existantes si on en a pour éviter les doublons",
        "Utiliser un langage clair et précis pour chaque quête",
        "Forme une progression logique avec des tâches distinctes.",
        "Si un outil ou logiciel est requis (ex: Figma, VSCode, Canva), inclure un lien d'accès ou de téléchargement.",
        "Si une ressource externe est mentionnée (tutoriel, article, vidéo, etc.), inclure un **lien cliquable** (URL valide) vers une ressource recommandée.",
        "Si le lien est hypothétique, utiliser un format : [Titre de la ressource](https://exemple.com) pour qu'il soit cliquable.",
      ];

      const extras = [
        `Style d'apprentissage : ${form.styleApprentissage === "Equilibré" ? "Équilibré (théoriques et pratiques)" : form.styleApprentissage}`,
        `Types de ressources : ${form.ressourceType?.length ? form.ressourceType.join(", ") : "Aucun"}`,
        `Compétence connexe : ${form.relatedSkill || "Aucune"}`,
        `Ambiance des quêtes : ${form.ambianceQueteStyle}`,
      ];

      const descriptionFormatNote = `
      ⚠️ Toutes les informations (objectifs, étapes, ressources, outils, etc.) doivent être incluses **dans le champ \`description\`**, sous une forme lisible, claire et structurée.

          Format suggéré (indicatif, pas rigide) :
          ---
          **Objectif** : Définir clairement ce que l'apprenant va accomplir.  
          **Étapes** :  
          1. Étape 1...  
          2. Étape 2...  
          **Ressources** (avec liens cliquables) :  
          - [Nom de la ressource](https://exemple.com)  
          **Outils recommandés** :  
          - [Nom de l'outil](https://exemple.com)  

          Peut inclure d'autres sections utiles si pertinent (ex : Astuce, Pour aller plus loin, etc.).
          ---
          `;

      instruction = [
        ...baseInstructions,
        "\nCritères de qualité :",
        ...qualityCriteria.map((c) => `- ${c}`),
        ...extras,
        descriptionFormatNote,
      ].join("\n");
    }
  }

  return {
    existingQuests,
    format: {
      title: "string",
      description: "string",
      xp: "number",
      difficulty: "EASY|MEDIUM|HARD",
      prerequisites: "string[] (optional)",
    },
    instruction: instruction,
  };
};
