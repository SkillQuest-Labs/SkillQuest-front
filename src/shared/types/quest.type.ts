export type QuestDifficulty = "EASY" | "MEDIUM" | "HARD";

export type QuestStatus = "LOCKED" | "UNLOCKED" | "COMPLETED";

export type QuestPosition = {
  x: number;
  y: number;
};

export type Quest = {
  id?: string;
  questId: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  xp: number;
  degree?: number;
  status: QuestStatus;
  isSubSkill: boolean;
  completionTime: string; // ISO format (e.g., 2025-07-01T12:34:56Z)
  position: QuestPosition;
  skillId: string;
};

export type QuestRelation = {
  id?: string;
  questRelationId?: string;
  parentQuestId?: string;
  parentSkillId?: string;
  childQuestId: string;
};
