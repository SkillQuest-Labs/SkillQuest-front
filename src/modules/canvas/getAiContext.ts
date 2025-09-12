import type { AiContextType, QuestAiType, QuestGenerationForm } from "@/shared/types/ai/ai.type";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";
import type { Node } from "@xyflow/react";
import { isQuestNode, isSkillNode } from "./canvas.const";
import type { SkillNodeData } from "./canvas.type";

const buildInstruction = (
  form?: Partial<QuestGenerationForm>,
  skill?: Node<SkillNodeData> | undefined,
  existingQuests?: QuestAiType[],
): string => {
  if (!form || !skill) return "";

  // Format de sortie (Impératif et structuré)
  const formatInstructions = [
    "\n## FORMAT DE SORTIE",
    "La sortie doit être un tableau JSON valide. Ne rien inclure avant ou après le tableau. Voici la structure de chaque objet quête :",
    "```json",
    `{
      "title": "string (Titre court, clair et engageant)",
      "description": "string (Description détaillée en Markdown avec objectifs, étapes, etc. SANS liens directs)",
      "resources": [
        {
          "type": "video",
          "query": "React hooks tutorial débutant",
          "preferred_domains": ["youtube.com", "vimeo.com"],
          "must_include_keywords": ["react", "hooks", "tutorial"],
          "language": "fr",
          "difficulty_level": "beginner"
        },
        {
          "type": "documentation",
          "query": "React hooks documentation officielle",
          "preferred_domains": ["reactjs.org", "react.dev"],
          "must_include_keywords": ["react", "hooks", "documentation"],
          "language": "en",
          "difficulty_level": "intermediate"
        }
      ]
    }`,
    "```",
    "",
    "**RAPPEL IMPORTANT** : Les ressources ne doivent contenir AUCUNE URL directe, seulement des intentions de recherche.",
  ];

  if (form.manualContext && form.contextText?.trim()) {
    return [form.contextText.trim(), ...formatInstructions].join("\n");
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
    "- **IMPORTANT** : Ne génère JAMAIS d'URLs directes. Génère uniquement des intentions de recherche structurées.",
    "- **Format des ressources** : Chaque ressource doit être un objet avec :",
    "  * `type` : 'video' | 'article' | 'documentation' | 'course' | 'podcast' | 'forum' ",
    "  * `query` : Termes de recherche précis en français",
    "  * `preferred_domains` : Domaines privilégiés (ex: ['youtube.com', 'vimeo.com'] pour video)",
    "  * `must_include_keywords` : Mots-clés obligatoires dans le contenu",
    "  * `language` : 'fr' ou 'en'",
    "  * `difficulty_level` : 'beginner' | 'intermediate' | 'advanced'",
    "- **Types et domaines recommandés** :",
    "  * **video** : ['youtube.com', 'vimeo.com', 'dailymotion.com']",
    "  * **documentation** : ['*.org', '*.dev', 'developer.mozilla.org', 'docs.microsoft.com']",
    "  * **article** : ['medium.com', 'dev.to', 'css-tricks.com', 'smashingmagazine.com']",
    "  * **course** : ['coursera.org', 'udemy.com', 'edx.org', 'khan academy.org']",
    "  * **forum** : ['stackoverflow.com', 'reddit.com', 'discourse.org']",
    "  * **tool** : Sites officiels des outils (ex: 'figma.com', 'code.visualstudio.com')",
    `- **Types de ressources à privilégier** : Inclus des ressources correspondant à ces types : ${form.ressourceType?.join(", ")}.`,
    "- **Cohérence avec le domaine** : Adapte les domaines selon le skill (ex: 'marmiton.org' pour cuisine, 'github.com' pour développement).",
    "- **Qualité des recherches** : Utilise des termes précis et pertinents pour faciliter la résolution automatique.",
  ];

  return [...roleAndGoal, ...context, ...generalRules, ...resourceRules, ...formatInstructions].join("\n");
};

/**
 * Valide que le contexte généré contient toutes les informations nécessaires
 */
const validateContext = (context: AiContextType): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  console.log("🔍 [getAiContext] Validation du contexte généré");

  // Vérification de l'instruction
  if (!context.instruction || context.instruction.trim().length === 0) {
    errors.push("Instruction vide ou manquante");
  } else if (context.instruction.trim().length < 50) {
    errors.push("Instruction trop courte (moins de 50 caractères)");
  }

  // Vérification du provider AI
  if (!context.aiProvider || !["openai", "gemini"].includes(context.aiProvider)) {
    errors.push(`Provider AI invalide: ${context.aiProvider}`);
  }

  // Vérification du format
  if (!context.format || typeof context.format !== "object") {
    errors.push("Format de réponse manquant ou invalide");
  }

  const isValid = errors.length === 0;

  if (isValid) {
    console.log("✅ [getAiContext] Contexte valide", {
      instructionLength: context.instruction.length,
      provider: context.aiProvider,
      existingQuestsCount: context.existingQuests?.length || 0,
    });
  } else {
    console.error("❌ [getAiContext] Contexte invalide", {
      errors,
      instructionLength: context.instruction?.length || 0,
      provider: context.aiProvider,
    });
  }

  return { isValid, errors };
};

export const getAiContext = (): AiContextType => {
  console.log("🎯 [getAiContext] Génération du contexte IA");

  const { nodes } = useCanvasStore.getState();
  const { form } = useQuestGenerationFormStore.getState();
  const skillNode = nodes.find(isSkillNode);

  // Validation des prérequis
  if (!form || Object.keys(form).length === 0) {
    console.warn("⚠️ [getAiContext] Formulaire manquant ou vide");
  }

  if (!skillNode) {
    console.warn("⚠️ [getAiContext] Aucun nœud de skill trouvé sur le canvas");
  }

  const existingQuests: QuestAiType[] = nodes.filter(isQuestNode).map((node) => ({
    title: node.data.title,
    description: node.data.description,
    prerequisites: [],
  }));

  console.log("📊 [getAiContext] État du contexte", {
    hasForm: !!form,
    hasSkillNode: !!skillNode,
    existingQuestsCount: existingQuests.length,
    skillTitle: skillNode?.data?.config?.title,
  });

  let instruction = "";

  if (form && Object.keys(form).length > 0 && skillNode) {
    instruction = buildInstruction(form, skillNode, existingQuests);
  } else {
    console.error("❌ [getAiContext] Impossible de construire l'instruction", {
      hasForm: !!form,
      formKeysCount: form ? Object.keys(form).length : 0,
      hasSkillNode: !!skillNode,
    });
  }

  const context: AiContextType = {
    aiProvider: form?.aiProvider || "openai",
    existingQuests,
    format: {
      title: "string",
      description: "string",
      xp: "number",
      difficulty: "EASY|MEDIUM|HARD",
      resources: "ResourceIntention[]",
      prerequisites: "string[] (optional)",
    },
    instruction,
  };

  // Validation du contexte généré
  const validation = validateContext(context);
  if (!validation.isValid) {
    console.error("💥 [getAiContext] Contexte généré invalide", {
      errors: validation.errors,
      context: {
        instructionLength: context.instruction?.length || 0,
        provider: context.aiProvider,
      },
    });
  }

  return context;
};
