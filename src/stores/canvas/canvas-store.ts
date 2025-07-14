import { useSkillStore } from "@/stores/skill/skillStore";
import { useQuestStore } from "../quest/quest-store";
import { create } from "zustand";

type CanvasStore = {
  resetCanvasStore: () => void;
};

export const useCanvasStore = create<CanvasStore>(() => ({
  resetCanvasStore: () => {
    useQuestStore.getState().reset();
    useSkillStore.getState().reset();
  },
}));
