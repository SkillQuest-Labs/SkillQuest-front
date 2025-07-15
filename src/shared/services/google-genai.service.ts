import { GoogleGenerativeAI } from "@google/genai";
import type { Skill } from "@/shared/types/skill.type";
import type { Quest } from "@/shared/types/quest.type";

export type GenerateSkillWithQuestsResult = {
  skill: Skill;
  quests: Quest[];
};

const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export const generateSkillWithQuests = async (
  context: string,
): Promise<GenerateSkillWithQuestsResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Genere un skill avec des quetes en suivant ce contexte:\n${context}\n` +
    `Reponds uniquement avec un JSON contenant un objet { skill: Skill, quests: Quest[] }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as GenerateSkillWithQuestsResult;
};
