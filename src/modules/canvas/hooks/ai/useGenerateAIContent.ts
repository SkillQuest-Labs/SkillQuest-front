import { useGeminiContext } from "@/modules/canvas/hooks/ai/useGeminiContext";
import { useGemini } from "@/shared/services/gemini-ai/api-gemini";

export const useGenerateAiContente = () => {
  const context = useGeminiContext();

  const prompt = `
    Skill :
    Titre : ${context.skill?.title}
    Description : ${context.skill?.description}
    Difficulté : ${context.skill?.difficulty}

    Quêtes existantes :
    ${context.existingQuests.map((q) => `- ${q.title} : ${q.description} (xp: ${q.xp}, difficulté: ${q.difficulty})`).join("\n")}

    Format attendu : ${JSON.stringify(context.format)}
    Instruction : ${context.instruction}
  `;

  const data = useGemini(prompt);

  return data;
};
