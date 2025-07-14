import { create } from "zustand";
import type { Skill } from "@/shared/types/skill.type";

type SkillStore = {
  skill: Skill;
  setSkill: (skill: Skill) => void;
  reset: () => void;
};

const initialSkillState: Skill = {
  id: "",
  title: "",
  description: "",
  status: "DRAFT",
  difficulty: "EASY",
  completionTime: null,
  userId: "",
};

export const useSkillStore = create<SkillStore>((set) => ({
  skill: initialSkillState,
  setSkill: (skill) => set(() => ({ skill })),
  reset: () => set(() => ({ skill: initialSkillState })),
}));
