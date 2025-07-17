import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "@/shared/config/gemini-config";

export const useGemini = async (prompt: string) => {
  const GEMINI_API_KEY = geminiConfig.googleGenaiApiKey || "";

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
  });

  return response.text;
};
