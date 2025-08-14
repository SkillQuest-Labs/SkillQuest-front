import { callGeminiApi } from "@/shared/lib/gemini-api";
import { callOpenaiApi } from "@/shared/lib/openai-api";
import type { AiContextType, QuestAiType } from "@/shared/types/ai/ai.type";

export const generateQuestsFromAI = async (context: AiContextType): Promise<QuestAiType[]> => {
  if (!context || !context.instruction.trim()) {
    return [];
  }

  const prompt = `
    Instructions :
    ${context.instruction}
    `;

  try {
    const provider = context.aiProvider || "gemini";
    const rawResponse = provider === "gemini" ? await callGeminiApi(prompt) : await callOpenaiApi(prompt);

    const jsonMatch = rawResponse?.match(/```json([\s\S]*?)```/i);

    const jsonText = (jsonMatch ? jsonMatch[1] : rawResponse).trim();

    const parsed = JSON.parse(jsonText) as unknown;
    if (!Array.isArray(parsed)) return [];

    // Filtrage et typage des quêtes brutes
    return parsed
      .filter(
        (item: any) =>
          item &&
          typeof item.title === "string" &&
          typeof item.description === "string" &&
          typeof item.xp === "number" &&
          ["EASY", "MEDIUM", "HARD"].includes(item.difficulty),
      )
      .map((item: any) => ({
        title: item.title,
        description: item.description,
        xp: item.xp,
        difficulty: item.difficulty,
        prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites : [],
        resources: Array.isArray(item.resources) ? item.resources : [],
      }));
  } catch {
    return [];
  }
};
