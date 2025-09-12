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
  console.log("🤖 [OpenAI API] Début de l'appel API");

  const OPENAI_API_KEY = openaiConfig.openaiApiKey || "";
  const BASE_URL = openaiConfig.openaiBaseUrl || "";

  if (!OPENAI_API_KEY) {
    console.error("❌ [OpenAI API] Clé API manquante");
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
    console.log("📤 [OpenAI API] Envoi de la requête avec timeout de 2min", {
      promptLength: prompt.length,
      timeout: TIMEOUT_MS,
      baseUrl: BASE_URL,
    });

    const apiCall = ai.chat.completions.create({
      model: "openai/gpt-oss-120b:novita",
      messages: [{ role: "user", content: prompt }],
    });

    const response = await withTimeout(apiCall, TIMEOUT_MS);

    const content = response?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      console.error("❌ [OpenAI API] Réponse invalide - pas de contenu texte");
      throw new Error("OpenAI API did not return a text response.");
    }

    console.log("✅ [OpenAI API] Réponse reçue avec succès", {
      responseLength: content.length,
      model: "openai/gpt-oss-120b:novita",
    });

    return content;
  } catch (error: any) {
    // Gestion spécifique des erreurs de timeout
    if (error.message && error.message.includes("Timeout")) {
      console.error("⏰ [OpenAI API] Erreur de timeout", {
        timeout: TIMEOUT_MS,
        promptLength: prompt.length,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`OpenAI API timeout: L'appel a pris plus de ${TIMEOUT_MS / 1000} secondes`);
    }

    // Autres erreurs
    console.error("💥 [OpenAI API] Erreur lors de l'appel", {
      error: error.message || error,
      stack: error.stack,
      promptLength: prompt.length,
      baseUrl: BASE_URL,
      timestamp: new Date().toISOString(),
    });

    throw new Error(`OpenAI API error: ${error.message || "Something went wrong with OpenAI API"}`);
  }
};
