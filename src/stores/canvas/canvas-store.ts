import { useSkillStore } from "@/stores/skill/skillStore";
import { useQuestStore } from "../quest/quest-store";

export const resetCanvasStore = () => {
  useQuestStore.getState().reset();
  useQuestStore.getState().setNodes([]);
  useSkillStore.getState().reset();
};
