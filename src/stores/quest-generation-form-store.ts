import { create } from "zustand";

export type QuestGenerationForm = {
  manualContext?: boolean;
  contextText?: string;
  goal?: string;
  description?: string;
  selfLevel?: string;
  weeklyTime?: string;
  autoEstimate?: boolean;
  numberOfQuests?: number;
  modality?: "Théorique" | "Equilibré" | "Pratique";
  themeStyle?: string;
  toolsConstraint?: string;
  rewardPreference?: string;
};

type QuestGenerationFormStore = {
  form: Partial<QuestGenerationForm>;
  setForm: (data: Partial<QuestGenerationForm>) => void;
  reset: () => void;
};

export const useQuestGenerationFormStore = create<QuestGenerationFormStore>((set) => ({
  form: {},
  setForm: (data) => set((state) => ({ form: { ...state.form, ...data } })),
  reset: () => set({ form: {} }),
}));
