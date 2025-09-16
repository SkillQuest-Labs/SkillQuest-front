import { GoogleGenAI } from "@google/genai";
import { geminiConfig } from "../config/gemini-config";

/**
 * Crée une promesse avec timeout
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Timeout: L'opération a pris plus de ${timeoutMs}ms`));
      }, timeoutMs);
    }),
  ]);
};

export const callGeminiApi = async (prompt: string): Promise<string> => {
  const GEMINI_API_KEY = geminiConfig.googleGenaiApiKey || "";

  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const TIMEOUT_MS = 120000; // 2 minutes

  try {
    const apiCall = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const response = await withTimeout(apiCall, TIMEOUT_MS);

    if (typeof response.text !== "string") {
      throw new Error("Gemini API did not return a text response.");
    }

    return response.text;
  } catch (error: any) {
    // Gestion spécifique des erreurs de timeout
    if (error.message && error.message.includes("Timeout")) {
      throw new Error(`Gemini API timeout: L'appel a pris plus de ${TIMEOUT_MS / 1000} secondes`);
    }

    // Autres erreurs

    throw new Error(`Gemini API error: ${error.message || "Something went wrong with Gemini API"}`);
  }
};
