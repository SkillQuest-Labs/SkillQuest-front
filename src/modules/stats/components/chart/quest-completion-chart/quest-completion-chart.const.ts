import type { Skill } from "@/shared/types/skill.type";

export const buildQuestCompletionData = (skills: Skill[]) => {
  if (skills.length === 0) return [];

  return skills.map((skill) => {
    const totalQuests = skill.totalQuests ?? 0;
    const completedQuests = skill.completedQuests ?? 0;
    const remainingQuests = totalQuests - completedQuests;
    return {
      skillId: skill.id ?? "",
      skillName: skill.title ?? "",
      completedQuests: skill.completedQuests ?? 0,
      remainingQuests: remainingQuests ?? 0,
      totalQuests: skill.totalQuests ?? 0,
      totalXp: skill.totalXp ?? 0,
    };
  });
};

export const filterStatusOptions = [
  { key: "all", label: "Toutes", icon: "•" },
  { key: "completed", label: "Complétées", icon: "•" },
  { key: "in_progress", label: "En cours", icon: "•" },
];

export const questCompletionRange = [
  {
    min: 0,
    max: 25,
    label: "0-25%",
    color: "from-slate-600/20 to-red-500/20",
    activeColor: "from-slate-600/40 to-red-500/30",
    textColor: "text-slate-300",
    width: "w-24",
  },
  {
    min: 25,
    max: 50,
    label: "25-50%",
    color: "from-slate-600/20 to-orange-500/20",
    activeColor: "from-slate-600/40 to-orange-500/30",
    textColor: "text-slate-300",
    width: "w-24",
  },
  {
    min: 50,
    max: 75,
    label: "50-75%",
    color: "from-slate-600/20 to-yellow-500/20",
    activeColor: "from-slate-600/40 to-yellow-500/30",
    textColor: "text-slate-300",
    width: "w-24",
  },
  {
    min: 75,
    max: 100,
    label: "75-100%",
    color: "from-slate-600/20 to-green-500/20",
    activeColor: "from-slate-600/40 to-green-500/30",
    textColor: "text-slate-300",
    width: "w-24",
  },
  {
    min: 0,
    max: 100,
    label: "Tout",
    color: "from-slate-600/20 to-blue-500/20",
    activeColor: "from-slate-600/40 to-blue-500/30",
    textColor: "text-slate-300",
    width: "w-24",
  },
];

export const levelColors = [
  "from-slate-600 to-slate-500",
  "from-slate-500 to-slate-400",
  "from-blue-600 to-blue-500",
  "from-blue-500 to-blue-400",
  "from-blue-400 to-blue-300",
];

export const levelIcons = [
  "🧑‍🎓", // Level 1: Novice/Apprentice
  "🧝‍♂️", // Level 2: Aventurier
  "⚔️", // Level 3: Warrior
  "👑", // Level 4: Champion
  "🐉", // Level 5: Dragon/Legend
];
