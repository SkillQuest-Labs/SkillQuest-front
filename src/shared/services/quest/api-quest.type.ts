import type { Quest } from "@/shared/types/quest.type";

export type GetQuestResponse = {
  quests: Quest[];
  total: number;
};
