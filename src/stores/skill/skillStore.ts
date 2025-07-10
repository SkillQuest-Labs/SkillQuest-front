import { create } from "zustand";
import type { Skill, SkillStatus } from "@/shared/types/skill.type";

type skillState = Skill & {
  id: string;
  status: SkillStatus;
  completionTime: null;
  userId: string;
};
type SkillStore = {
  skill: skillState;
  setSkill: (skill: skillState) => void;
};

export const useSkillStore = create<SkillStore>((set) => ({
  skill: {
    id: "",
    title: "",
    description: "",
    status: "DRAFT",
    difficulty: "EASY",
    completionTime: null,
    userId: "",
  },
  setSkill: (skill) => set(() => ({ skill })),
}));
