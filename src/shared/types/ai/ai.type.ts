import type { Quest } from "../quest.type";

export type ResourceIntention = {
  type: "video" | "article" | "documentation" | "course" | "podcast" | "forum";
  query: string;
  preferred_domains: string[];
  must_include_keywords: string[];
  language: "fr" | "en";
  difficulty_level: "beginner" | "intermediate" | "advanced";
};

export type QuestAiType = Partial<Quest> & {
  prerequisites?: string[];
  resources?: ResourceIntention[];
};

export type AiProvider = "openai" | "gemini";

export type AiContextType = {
  aiProvider?: AiProvider;
  existingQuests: QuestAiType[];
  format: Record<
    keyof {
      title: string;
      description: string;
      xp: number;
      difficulty: "EASY" | "MEDIUM" | "HARD";
      resources: ResourceIntention[];
      prerequisites?: string[];
    },
    string
  >;
  instruction: string;
};

export type QuestGenerationForm = {
  aiProvider?: AiProvider;
  manualContext: boolean;
  contextText: string;
  goal: string;
  selfLevel: string;
  relatedSkill: string;
  autoEstimate: boolean;
  numberOfQuests: number;
  styleApprentissage: "Théorique" | "Equilibré" | "Pratique";
  ambianceQueteStyle: string;
  ressourceType: string[];
  skillDomain?: string;
  customDomain?: string;
};

export type ResolvedResource = {
  title: string;
  url: string;
  type: ResourceIntention["type"];
  isValid: boolean;
  score: number; // 0-100, pertinence de la ressource
  domain: string;
};
