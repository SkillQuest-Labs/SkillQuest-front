import { create } from "zustand";

export type SkillDifficulty = "EASY" | "MEDIUM" | "HARD";

export type SkillData = {
  title: string;
  description: string;
  difficulty: SkillDifficulty;
};

export type SkillStore = {
  skill: SkillData;
  setSkill: (skill: Partial<SkillData>) => void;
  reset: () => void;
};

const initialState: SkillData = {
  title: "",
  description: "",
  difficulty: "EASY",
};

export const useSkillStore = create<SkillStore>((set) => ({
  skill: initialState,
  setSkill: (skill) =>
    set((state) => ({ skill: { ...state.skill, ...skill } })),
  reset: () => set({ skill: initialState }),
}));
