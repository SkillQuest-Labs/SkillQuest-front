import type { QuestAiType } from "@/shared/types/ai/ai.type";
import { getGeminiContext } from "./useGeminiContext";
import { generateQuestsFromAI } from "../../generate-quests-from-ai";

export const useGenerateAIContent = () => {
  // const context = useGeminiContext();

  const generate = async (): Promise<QuestAiType[]> => {
    const context = getGeminiContext();
    if (!context.instruction.trim()) return [];
    return await generateQuestsFromAI(context);
  };

  return { generate };
};
