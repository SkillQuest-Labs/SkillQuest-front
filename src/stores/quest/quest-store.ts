import type { Quest } from "@/shared/types/quest.type";
import { create } from "zustand";

type QuestStore = {
  quests: Quest[];
  setQuests: (quests: Quest[]) => void;
  addQuest: (quest: Quest) => void;
  removeQuest: (id: string) => void;
  reset: () => void;
};

export const useQuestStore = create<QuestStore>((set) => ({
  quests: [],
  setQuests: (quests) => set({ quests }),
  addQuest: (quest) =>
    set((state) => ({
      quests: [...state.quests, quest],
    })),
  removeQuest: (id: string) =>
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== id),
    })),
  reset: () => set({ quests: [] }),
}));
