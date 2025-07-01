import type { Difficulty } from "../enums/quest-difficulty.enum";

export type Quest = {
  id?: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  degree: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isSubSkill: boolean;
  completionTime: string; // ISO format (e.g., 2025-07-01T12:34:56Z)
  positionX: number;
  positionY: number;
  skillId: string;
};
