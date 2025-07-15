declare module "@google/genai" {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(options: { model: string }): {
      generateContent(prompt: string): Promise<{ response: { text(): string } }>;
    };
  }
}
