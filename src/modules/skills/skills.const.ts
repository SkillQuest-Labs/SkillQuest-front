import type { SkillDifficulty, SkillStatus } from "./skills.types";

// import img1 from "../../assets/skills/1.png";
// import img2 from "../../assets/skills/2.png";
// import img3 from "../../assets/skills/3.png";
// import img4 from "../../assets/skills/4.png";
// import img5 from "../../assets/skills/5.png";
// import img6 from "../../assets/skills/6.png";
// import img7 from "../../assets/skills/7.png";
// import img8 from "../../assets/skills/8.png";
// import img9 from "../../assets/skills/9.png";
// import img10 from "../../assets/skills/10.png";
// import img11 from "../../assets/skills/11.png";

export const difficultyColors = {
  EASY: "bg-green-100 text-green-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HARD: "bg-red-100 text-red-800",
  ALL: "bg-gray-100 text-gray-800",
};

export const statusColors = {
  DRAFT: "bg-gray-200 text-gray-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  NOT_STARTED: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  ALL: "bg-gray-100 text-gray-800",
};

export const statusLabels = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN PROGRESS",
  NOT_STARTED: "NOT STARTED",
  COMPLETED: "COMPLETED",
  ALL: "ALL",
};

// Constantes pour la page de détail (sans ALL)
export const difficultyDetailColors = {
  EASY: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HARD: "bg-red-500",
} as const;

export const statusDetailColors = {
  DRAFT: "bg-gray-500",
  NOT_STARTED: "bg-blue-500",
  IN_PROGRESS: "bg-yellow-500",
  COMPLETED: "bg-green-500",
} as const;

export const statusDetailLabels = {
  DRAFT: "Brouillon",
  NOT_STARTED: "Non commencé",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
} as const;

export const difficultyDetailLabels = {
  EASY: "Facile",
  MEDIUM: "Moyen",
  HARD: "Difficile",
} as const;

export const SKILLS_PER_PAGE = 12;

// Fonctions utilitaires pour les couleurs et labels
export const getDifficultyColor = (difficulty: SkillDifficulty) => {
  if (difficulty === "ALL") return "bg-gray-500";
  return difficultyDetailColors[difficulty as keyof typeof difficultyDetailColors] || "bg-gray-500";
};

export const getStatusColor = (status: SkillStatus) => {
  if (status === "ALL") return "bg-gray-500";
  return statusDetailColors[status as keyof typeof statusDetailColors] || "bg-gray-500";
};

export const getStatusLabel = (status: SkillStatus) => {
  if (status === "ALL") return status;
  return statusDetailLabels[status as keyof typeof statusDetailLabels] || status;
};

export const getDifficultyLabel = (difficulty: SkillDifficulty) => {
  if (difficulty === "ALL") return difficulty;
  return difficultyDetailLabels[difficulty as keyof typeof difficultyDetailLabels] || difficulty;
};
