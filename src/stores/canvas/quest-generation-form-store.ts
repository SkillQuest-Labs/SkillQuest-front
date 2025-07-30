import { create } from "zustand";

export type QuestGenerationForm = {
  manualContext: boolean;
  contextText: string;
  goal: string;
  goalDescription: string;
  selfLevel: string;
  relatedSkill: string;
  autoEstimate: boolean;
  numberOfQuests: number;
  styleApprentissage: "Théorique" | "Equilibré" | "Pratique";
  ambianceQueteStyle: string;
  ressourceType: string[];
};

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
