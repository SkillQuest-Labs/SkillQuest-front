import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "../config/gemini-config";

export const callGeminiApi = async (prompt: string): Promise<string> => {
  const GEMINI_API_KEY = geminiConfig.googleGenaiApiKey || "";

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (typeof response.text !== "string") {
      throw new Error("Gemini API did not return a text response.");
    }

    return response.text;
  } catch {
    throw "something went wrong with Gemini API";
  }
};
