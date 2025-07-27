import type { Quest } from "../quest.type";
import type { Skill } from "../skill.type";

export type SkillAiType = Partial<Skill> & {
  level: string;
  goal: string;
};

export type QuestAiType = Partial<Quest> & {
  prerequisites?: string[];
};

export type GeminiContext = {
  skill: SkillAiType;
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
