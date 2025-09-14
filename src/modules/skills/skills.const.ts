import type { FilterSkillDifficulty, FilterSkillStatus } from "./skills.types";

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
export const getDifficultyColor = (difficulty: FilterSkillDifficulty) => {
  if (difficulty === "ALL") return "bg-gray-500";
  return difficultyDetailColors[difficulty as keyof typeof difficultyDetailColors] || "bg-gray-500";
};

export const getStatusColor = (status: FilterSkillStatus) => {
  if (status === "ALL") return "bg-gray-500";
  return statusDetailColors[status as keyof typeof statusDetailColors] || "bg-gray-500";
};

export const getStatusLabel = (status: FilterSkillStatus) => {
  if (status === "ALL") return status;
  return statusDetailLabels[status as keyof typeof statusDetailLabels] || status;
};

export const getDifficultyLabel = (difficulty: FilterSkillDifficulty) => {
  if (difficulty === "ALL") return difficulty;
  return difficultyDetailLabels[difficulty as keyof typeof difficultyDetailLabels] || difficulty;
};

// Constantes pour SkillCard
export const SKILL_CARD_CONSTANTS = {
  DEFAULT_IMAGE: "/src/assets/skills/forest.webp",
  PROGRESS_BAR_HEIGHT: "h-2",
  CARD_BORDER_RADIUS: "rounded-2xl",
  BUTTON_HEIGHT: "h-full",
  OVERLAY_GRADIENT: "from-slate-900/30 via-slate-900/50 to-slate-900/90",
  PROGRESS_GRADIENT: "from-blue-400 via-sky-400 to-cyan-400",
  BACKDROP_BLUR: "backdrop-blur-sm",
  BORDER_OPACITY: "border-white/20",
  TEXT_SHADOW: "drop-shadow-lg",
  LINE_CLAMP: "line-clamp-2",
} as const;

// Classes CSS pour les actions de carte
export const SKILL_CARD_ACTIONS = {
  CONTAINER: "mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm",
  EDIT_BUTTON: "btn-action btn-edit h-full w-full rounded-l-lg rounded-r-none bg-transparent text-white hover:text-white hover:bg-white/10 transition-colors",
  DELETE_BUTTON: "btn-action btn-delete h-full w-full rounded-r-lg rounded-l-none bg-transparent text-white hover:text-white hover:bg-red-500/20 disabled:opacity-50 transition-colors",
  LOADING_SPINNER: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
} as const;

// Classes CSS pour les éléments de progression
export const SKILL_CARD_PROGRESS = {
  CONTAINER: "rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 border border-white/20",
  BAR_CONTAINER: "w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/10",
  BAR_FILL: "h-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 transition-all duration-700 ease-out",
} as const;
