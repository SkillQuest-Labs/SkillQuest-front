export const Difficulty = {
  Facile: "Facile",
  Moyen: "Moyen",
  Difficile: "Difficile",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const Status = {
  NotStarted: "not_started",
  InProgress: "in_progress",
  Completed: "completed",
  Draft: "draft",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export type Skill = {
  id: string;
  title: string;
  description?: string;
  difficulty: Difficulty;
  duration: number; // in minutes
  status: Status;
  category?: string;
  createdAt: string;
  updatedAt: string;
  progress?: number; // 0-100
  questsCount?: number;
};
