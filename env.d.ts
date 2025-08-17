interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_GENAI_API_KEY: string;
  readonly VITE_OPENAI_HUGGINGFACE_API_KEY: string;
  readonly VITE_OPENAI_HUGGINGFACE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
