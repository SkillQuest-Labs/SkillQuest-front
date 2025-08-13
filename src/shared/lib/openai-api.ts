import { OpenAI } from "openai";
import { openaiConfig } from "../config/openai-config";

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
  });

  try {
    const response = await ai.chat.completions.create({
      model: "openai/gpt-oss-120b:novita",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new Error("OpenAI API did not return a text response.");
    }

    return content;
  } catch {
    throw "something went wrong with OpenAI API";
  }
};
