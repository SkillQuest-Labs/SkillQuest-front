import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { isQuestNode, isSkillNode } from "../../canvas.const";
import type { GeminiContext, QuestAiType, QuestGenerationForm } from "@/shared/types/ai/ai.type";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";
import type { SkillNodeData } from "../../canvas.type";
import type { Node } from "@xyflow/react";

const buildInstruction = (
  form?: Partial<QuestGenerationForm>,
  skill?: Node<SkillNodeData> | undefined,
  existingQuests?: QuestAiType[],
): string => {
  if (!form || !skill) return "";

  if (form.manualContext && form.contextText?.trim()) {
    return form.contextText.trim();
  }

  // 1. Rôle et Objectif principal (Très directif)
  const roleAndGoal = [
    "## RÔLE ET OBJECTIF",
    "Tu es un ingénieur pédagogique expert en gamification. Ta mission est de créer une série de quêtes d'apprentissage pour aider un utilisateur à maîtriser un nouveau skill.",
    `Génère exactement ${form.numberOfQuests ?? 4} quêtes pour le skill : '${skill.data.config.title}'.`,
    "Les quêtes doivent former une progression pédagogique cohérente, partant du niveau de l'utilisateur pour l'amener vers son objectif final.",
  ];

  // 2. Contexte de l'utilisateur et du skill
  const context = [
    "\n## CONTEXTE",
    `- **Skill à apprendre** : ${skill.data.config.title}`,
    `- **Description du skill** : ${skill.data.config.description}`,
    `- **Objectif final de l'utilisateur** : ${form.goal}`,
    `- **Description de l'objectif** : ${form.goalDescription}`,
    `- **Niveau actuel de l'utilisateur** : ${form.selfLevel}. La première quête doit être adaptée à ce niveau.`,
    `- **Style d'apprentissage préféré** : ${form.styleApprentissage}`,
    `- **Compétence connexe à considérer** : ${form.relatedSkill}. Si pertinent, suggère comment le skill principal peut interagir avec cette compétence.`,
    `- **Ambiance souhaitée pour les quêtes** : ${form.ambianceQueteStyle}`,
  ];

  // On ajoute les quêtes existantes s'il y en a
  if (existingQuests && existingQuests.length > 0) {
    context.push(
      `- **Quêtes existantes (ne pas les dupliquer)** : ${existingQuests.map((q) => `- ${q.title} : ${q.description} (xp: ${q.xp}, difficulté: ${q.difficulty})`).join(", ")}`,
    );
  }

  // 3. Règles et Critères de qualité (Clairs et concis)
  const rules = [
    "\n## RÈGLES DE GÉNÉRATION",
    "- **Progression logique** : Les quêtes doivent s'enchaîner logiquement (ex: Facile → Moyen → Difficile).",
    "- **Objectifs mesurables** : Chaque quête doit avoir un objectif concret et vérifiable.",
    "- **Ressources externes** : Chaque quête doit inclure au moins un lien cliquable (format Markdown `[Titre](https://...)`) vers une ressource externe pertinente et de qualité (tutoriel, vidéo, article, documentation).",
    `- **Types de ressources à privilégier** : Inclus des ressources correspondant à ces types : ${form.ressourceType?.join(", ")}.`,
    "- **Outils** : Si un outil est nécessaire (ex: Figma, VSCode), mentionne-le et fournis un lien.",
    // "- **Prérequis** : Pour les quêtes qui ne sont pas les premières, le champ `prerequisites` DOIT contenir le titre d'une ou plusieurs quêtes générées précédemment dans cette même liste. La première quête a un tableau de prérequis vide `[]`.",
    "- **Unicité** : Chaque quête doit être unique et apporter une nouvelle compétence.",
    "- **Contenu de la description** : Le champ `description` doit contenir TOUTES les informations (objectif, étapes, ressources, etc.) de manière structurée et lisible en Markdown.",
  ];

  // 4. Format de sortie (Impératif et structuré)
  const formatInstructions = [
    "\n## FORMAT DE SORTIE",
    "La sortie doit être un tableau JSON valide. Ne rien inclure avant ou après le tableau. Voici la structure de chaque objet quête :",
    "```json",
    `{
      "title": "string (Titre court, clair et engageant)",
      "description": "string (Description détaillée en Markdown avec objectifs, étapes, ressources, etc.)",
      "xp": "number (Ex: 100 pour facile, 250 pour moyen, 500 pour difficile)",
      "difficulty": "string (Doit être 'EASY', 'MEDIUM', ou 'HARD')",
    }`,
    "```",
  ];

  return [...roleAndGoal, ...context, ...rules, ...formatInstructions].join("\n");
};

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

  let instruction: string = "";

  if (form && Object.keys(form).length > 0 && skillNode) {
    console.log("test1", form);
    instruction = buildInstruction(form, skillNode, existingQuests);
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
