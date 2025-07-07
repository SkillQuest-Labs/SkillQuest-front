export enum Difficulty {
  Facile = "Facile",
  Moyen = "Moyen",
  Difficile = "Difficile",
}

export enum Status {
  NotStarted = "not_started",
  InProgress = "in_progress",
  Completed = "completed",
  Draft = "draft",
}

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
