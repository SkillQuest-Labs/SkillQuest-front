import type { Quest, QuestRelation } from "@/shared/types/quest.type";

export type GetQuestsResponse = {
  quests: Quest[];
  questRelations: QuestRelation[];
  total: number;
};

export type CreateQuestInput = Quest & {};

export type CreateQuestsResponse = {
  quests: Quest[];
  total: number;
};

export type UpdateQuestInput = Omit<Quest, "skillId">;

export type UpdateQuestsResponse = {
  quests: Quest[];
  total: number;
};

export type DeleteQuestId = {
  id: string;
  questId: string;
};

export type DeleteQuestRelationIds = {
  questRelationId: string;
};

export type CreateQuestRelationInput = QuestRelation;

export type CreateQuestRelationResponse = {
  relations: QuestRelation[];
};

export type GetQuestRelationResponse = QuestRelation[];
