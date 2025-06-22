import type { Skill } from "./skills.type";

export const mockedSkills: Skill[] = [
  {
    id: "1",
    title: "Apprendre React",
    difficulty: "Moyen",
    duration: 120,
    status: "published",
  },
  {
    id: "2",
    title: "Découvrir TypeScript",
    difficulty: "Facile",
    duration: 90,
    status: "draft",
  },
  {
    id: "3",
    title: "Créer un projet Vite",
    difficulty: "Facile",
    duration: 60,
    status: "published",
  },
];
