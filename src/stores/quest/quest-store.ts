import { create } from "zustand";
import type { Quest } from "@/shared/types/quest.type";

export type QuestStore = {
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  removeQuest: (questId: string) => void;
};

export const useQuestStore = create<QuestStore>((set) => ({
  quests: [],
  setQuests: (quests) => set({ quests }),
  addQuest: (quest) =>
    set((state) => ({ quests: [...state.quests, quest] })),
  removeQuest: (questId) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.questId !== questId),
    })),
}));
