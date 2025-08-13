import type { QuestAiType } from "@/shared/types/ai/ai.type";
import { getAiContext } from "./useAiContext";
import { generateQuestsFromAI } from "../../generate-quests-from-ai";

export const useGenerateAIContent = () => {
  const generate = async (): Promise<QuestAiType[]> => {
    const context = getAiContext();
    if (!context.instruction.trim()) return [];
    return await generateQuestsFromAI(context);
  };

  return { generate };
};
