import type { AiContextType, QuestAiType, QuestGenerationForm } from "@/shared/types/ai/ai.type";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";
import type { Node } from "@xyflow/react";
import { isQuestNode, isSkillNode } from "../../canvas.const";
import type { SkillNodeData } from "../../canvas.type";

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
    `Génère exactement ${form.numberOfQuests} quêtes pour le skill : '${skill.data.config.title}'.`,
    "Les quêtes doivent former une progression pédagogique cohérente, partant du niveau de l'utilisateur pour l'amener vers son objectif final.",
  ];

  // 2. Contexte de l'utilisateur et du skill
  const context = [
    "\n## CONTEXTE",
    `- **Skill à apprendre** : ${skill.data.config.title}`,
    `- **Description du skill** : ${skill.data.config.description}`,
    `- **Domaine d'apprentissage déclaré** : ${form.skillDomain === "Autre" ? form.customDomain : form.skillDomain}`,
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

  // 4. Règles et Critères de qualité (Clairs et concis)
  const generalRules = [
    "\n## RÈGLES DE GÉNÉRATION",
    "- **Progression logique** : Les quêtes doivent s'enchaîner logiquement (ex: Facile → Moyen → Difficile).",
    "- **Objectifs mesurables** : Chaque quête doit avoir un objectif concret et vérifiable.",
    "- **Cohérence domaine/skill** : VÉRIFIE que le skill corresponde bien au domaine déclaré. Si incohérent, adapte les ressources au skill réel.",
    "- **Unicité** : Chaque quête doit être unique et apporter une nouvelle compétence.",
    "- **Contenu de la description** : Le champ `description` doit contenir TOUTES les informations (objectif, étapes, ressources, etc.) de manière structurée et lisible en Markdown.",
  ];

  const resourceRules = [
    "\n## RÈGLES SPÉCIFIQUES AUX RESSOURCES",
    "- **Validité ABSOLUE des liens** : PRIORITÉ #1 - Utilise UNIQUEMENT des ressources qui existent réellement. Pour les vidéos, privilégie YouTube en premier, puis d'autres plateformes reconnues. Vérifie que les liens mènent vers des contenus existants et accessibles.",
    "- **Sources prioritaires par type** :",
    "  * **Vidéos** : 1) YouTube (chaînes populaires), 2) Vimeo, 3) Plateformes éducatives officielles",
    "  * **Documentation** : Sites officiels (.org, .edu, .gov), documentation développeur",
    "  * **Cours** : Plateformes reconnues (Coursera, Udemy, Khan Academy, edX)",
    "  * **Articles** : Blogs techniques reconnus, Medium avec auteurs vérifiés",
    "- **Qualité et validité des liens** : Priorise les sources officielles ou reconnues, liens HTTPS uniquement, n'invente JAMAIS d'URL, évite les contenus hors-sujet. En cas de doute sur l'existence d'une ressource, utilise une alternative générale mais sûre.",
    "- **Adaptation au domaine** : Choisis des ressources adaptées au domaine déclaré. Ex: si 'Cuisine', utilise des sites culinaires reconnus.",
    "- **Pas de liens morts** : INTERDIT de proposer des pages inexistantes/404. Si une ressource spécifique est introuvable, fournis une alternative officielle/générique existante.",
    `- **Types de ressources à privilégier** : Inclus des ressources correspondant à ces types : ${form.ressourceType?.join(", ")}.`,
    "- **Ressources externes** : Chaque quête doit inclure au minimum 1 lien cliquable (Markdown `[Titre](https://...)`) vers des ressources PERTINENTES et de qualité.",
    "- **Outils** : Si un outil est nécessaire (ex: Figma, VSCode), mentionne-le et fournis un lien officiel.",
  ];

  // 5. Format de sortie (Impératif et structuré)
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

  return [...roleAndGoal, ...context, ...generalRules, ...resourceRules, ...formatInstructions].join("\n");
};

export const getAiContext = (): AiContextType => {
  const { nodes } = useCanvasStore.getState();
  const { form } = useQuestGenerationFormStore.getState();
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
    instruction = buildInstruction(form, skillNode, existingQuests);
  }

  return {
    aiProvider: form.aiProvider || "openai",
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
