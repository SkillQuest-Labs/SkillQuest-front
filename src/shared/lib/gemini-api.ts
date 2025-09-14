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
  (window as any).debugLogger?.info("🤖 [Gemini API] Début de l'appel API");

  const GEMINI_API_KEY = geminiConfig.googleGenaiApiKey || "";

  if (!GEMINI_API_KEY) {
    (window as any).debugLogger?.error("❌ [Gemini API] Clé API manquante");
    throw new Error("Missing Gemini API key");
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const TIMEOUT_MS = 120000; // 2 minutes

  try {
    (window as any).debugLogger?.info("📤 [Gemini API] Envoi de la requête avec timeout de 2min", {
      promptLength: prompt.length,
      timeout: TIMEOUT_MS,
    });

    const apiCall = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const response = await withTimeout(apiCall, TIMEOUT_MS);

    if (typeof response.text !== "string") {
      (window as any).debugLogger?.error("❌ [Gemini API] Réponse invalide - pas de texte");
      throw new Error("Gemini API did not return a text response.");
    }

    (window as any).debugLogger?.info("✅ [Gemini API] Réponse reçue avec succès", {
      responseLength: response.text.length,
    });

    return response.text;
  } catch (error: any) {
    // Gestion spécifique des erreurs de timeout
    if (error.message && error.message.includes("Timeout")) {
      (window as any).debugLogger?.error("⏰ [Gemini API] Erreur de timeout", {
        timeout: TIMEOUT_MS,
        promptLength: prompt.length,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`Gemini API timeout: L'appel a pris plus de ${TIMEOUT_MS / 1000} secondes`);
    }

    // Autres erreurs
    (window as any).debugLogger?.error("💥 [Gemini API] Erreur lors de l'appel", {
      error: error.message || error,
      stack: error.stack,
      promptLength: prompt.length,
      timestamp: new Date().toISOString(),
    });

    throw new Error(`Gemini API error: ${error.message || "Something went wrong with Gemini API"}`);
  }
};
