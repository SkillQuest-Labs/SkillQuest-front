import type { QuestGenerationForm } from "@/shared/types/ai/ai.type";
import { create } from "zustand";

type QuestGenerationFormStore = {
  form: Partial<QuestGenerationForm>;
  setForm: (data: Partial<QuestGenerationForm>) => void;
  resetFormStore: () => void;
};

export const useQuestGenerationFormStore = create<QuestGenerationFormStore>((set) => ({
  form: {},
  setForm: (data) => set((state) => ({ form: { ...state.form, ...data } })),
  resetFormStore: () => set({ form: {} }),
}));
