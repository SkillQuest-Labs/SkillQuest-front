import { callGeminiApi } from "@/shared/lib/gemini-api";
import type { GeminiContext, QuestAiType } from "@/shared/types/ai/ai.type";

export const generateQuestsFromAI = async (context: GeminiContext): Promise<QuestAiType[]> => {
  if (!context.skill) return [];

  const prompt = `
    Tu es un générateur intelligent de quêtes d'apprentissage gamifiées.
    
    Skill :
    - Titre : ${context.skill.title}
    - Description : ${context.skill.description}
    - Difficulté : ${context.skill.difficulty}
    
    Quêtes existantes :
    ${context.existingQuests
      .map((q) => `- ${q.title} : ${q.description} (xp: ${q.xp}, difficulté: ${q.difficulty})`)
      .join("\n")}
    
    Instructions :
    ${context.instruction}
    Forme une progression logique avec des tâches distinctes.
    
    Format JSON attendu :
    [
      {
        "title": "string",
        "description": "string",
        "xp": number,
        "difficulty": "EASY" | "MEDIUM" | "HARD",
        "prerequisites": ["optional titles"]
      }
    ]
    Réponds uniquement avec le JSON.
    `;

  try {
    const rawResponse = await callGeminiApi(prompt);

    const jsonMatch = rawResponse?.match(/```json([\s\S]*?)```/i);

    const jsonText = (jsonMatch ? jsonMatch[1] : rawResponse).trim();

    const parsed = JSON.parse(jsonText) as unknown;
    if (!Array.isArray(parsed)) return [];

    // Filtrage et typage
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
      }));
  } catch (error) {
    console.error("Erreur lors de la génération des quêtes depuis l'IA :", error);
    return [];
  }
};
