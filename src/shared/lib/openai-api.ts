import { OpenAI } from "openai";
import { openaiConfig } from "../config/openai-config";

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

export const callOpenaiApi = async (prompt: string): Promise<string> => {
  const OPENAI_API_KEY = openaiConfig.openaiApiKey || "";
  const BASE_URL = openaiConfig.openaiBaseUrl || "";

  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key");
  }

  // IMPORTANT: allow usage in the browser context (Vite/React)
  const ai = new OpenAI({
    baseURL: BASE_URL || undefined,
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    timeout: 120000, // 2 minutes - timeout natif d'OpenAI
  });

  const TIMEOUT_MS = 120000; // 2 minutes

  try {
    const apiCall = ai.chat.completions.create({
      model: "openai/gpt-oss-120b:novita",
      messages: [{ role: "user", content: prompt }],
    });

    const response = await withTimeout(apiCall, TIMEOUT_MS);

    const content = response?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new Error("OpenAI API did not return a text response.");
    }

    return content;
  } catch (error: any) {
    // Gestion spécifique des erreurs de timeout
    if (error.message && error.message.includes("Timeout")) {
      throw new Error(`OpenAI API timeout: L'appel a pris plus de ${TIMEOUT_MS / 1000} secondes`);
    }

    // Autres erreurs

    throw new Error(`OpenAI API error: ${error.message || "Something went wrong with OpenAI API"}`);
  }
};
