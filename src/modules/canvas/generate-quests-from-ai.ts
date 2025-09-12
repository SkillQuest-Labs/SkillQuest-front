import { callGeminiApi } from "@/shared/lib/gemini-api";
import { callOpenaiApi } from "@/shared/lib/openai-api";
import type { AiContextType, QuestAiType } from "@/shared/types/ai/ai.type";

export const generateQuestsFromAI = async (context: AiContextType): Promise<QuestAiType[]> => {
  console.log("🚀 [AI Quest Generation] Starting generation process", { provider: context.aiProvider });

  if (!context || !context.instruction.trim()) {
    console.warn("⚠️ [AI Quest Generation] No context or instruction provided");
    return [];
  }

  const prompt = `
    Instructions :
    ${context.instruction}
    `;

  console.log("📝 [AI Quest Generation] Prompt prepared", { promptLength: prompt.length });

  try {
    const provider = context.aiProvider || "gemini";
    console.log("🔄 [AI Quest Generation] Calling AI API", { provider });

    const rawResponse = provider === "gemini" ? await callGeminiApi(prompt) : await callOpenaiApi(prompt);

    console.log("✅ [AI Quest Generation] Raw response received", {
      responseLength: rawResponse?.length || 0,
      hasResponse: !!rawResponse,
    });

    if (!rawResponse) {
      console.error("❌ [AI Quest Generation] Empty response from AI API");
      return [];
    }

    const jsonMatch = rawResponse?.match(/```json([\s\S]*?)```/i);
    const jsonText = (jsonMatch ? jsonMatch[1] : rawResponse).trim();

    console.log("🔍 [AI Quest Generation] Parsing JSON response", {
      foundJsonBlock: !!jsonMatch,
      jsonTextLength: jsonText.length,
    });

    const parsed = JSON.parse(jsonText) as unknown;

    if (!Array.isArray(parsed)) {
      console.error("❌ [AI Quest Generation] Parsed response is not an array", { parsedType: typeof parsed });
      return [];
    }

    console.log("📊 [AI Quest Generation] Raw quests parsed", { questCount: parsed.length });

    // Filtrage et typage des quêtes brutes
    const filteredQuests = parsed
      .filter((item: any) => item && typeof item.title === "string" && typeof item.description === "string")
      .map((item: any) => ({
        title: item.title,
        description: item.description,
        prerequisites: Array.isArray(item.prerequisites) ? item.prerequisites : [],
        resources: Array.isArray(item.resources) ? item.resources : [],
      }));

    console.log("✅ [AI Quest Generation] Quest generation completed successfully", {
      finalQuestCount: filteredQuests.length,
      filteredOut: parsed.length - filteredQuests.length,
    });

    return filteredQuests;
  } catch (error) {
    console.error("❌ [AI Quest Generation] Error during generation:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      provider: context.aiProvider,
      contextValid: !!context.instruction,
    });
    return [];
  }
};
