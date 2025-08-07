import type { SkillDifficulty } from "@/shared/types/skill.type";
import { create } from "zustand";

export type SkillData = {
  title: string;
  description: string;
  difficulty: SkillDifficulty;
};

export type SkillStore = {
  skill: SkillData;
  currentSkillId: string;

  setSkill: (skill: Partial<SkillData>) => void;
  setCurrentSkillId: (id: string) => void;
  reset: () => void;
};

const initialState: SkillData = {
  title: "",
  description: "",
  difficulty: "EASY",
};

export const useSkillStore = create<SkillStore>((set) => ({
  skill: initialState,
  currentSkillId: "",

  setCurrentSkillId: (id) => set({ currentSkillId: id }),
  setSkill: (skill) => set((state) => ({ skill: { ...state.skill, ...skill } })),
  reset: () => set({ skill: initialState }),
}));
