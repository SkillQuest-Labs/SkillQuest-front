import type { Quest } from "@/shared/types/quest.type";

export type GetQuestsResponse = {
  quests: Quest[];
  total: number;
};

export type CreateQuestInput = Quest & {};

export type CreateQuestsResponse = {
  quests: Quest[];
  total: number;
};
