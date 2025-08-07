import type { Quest } from "../quest.type";
import type { Skill } from "../skill.type";

export type SkillAiType = Partial<Skill> & {
  questNumber: number;
  level: string;
  goal: string;
  goalDescription: string;
};

export type QuestAiType = Partial<Quest> & {
  prerequisites?: string[];
};

export type GeminiContext = {
  existingQuests: QuestAiType[];
  format: Record<
    keyof {
      title: string;
      description: string;
      xp: number;
      difficulty: "EASY" | "MEDIUM" | "HARD";
      prerequisites?: string[];
    },
    string
  >;
  instruction: string;
};

export type QuestGenerationForm = {
  manualContext: boolean;
  contextText: string;
  goal: string;
  goalDescription: string;
  selfLevel: string;
  relatedSkill: string;
  autoEstimate: boolean;
  numberOfQuests: number;
  styleApprentissage: "Théorique" | "Equilibré" | "Pratique";
  ambianceQueteStyle: string;
  ressourceType: string[];
};
