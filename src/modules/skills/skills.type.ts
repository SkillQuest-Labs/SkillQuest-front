export type Skill = {
  id: string;
  title: string;
  description?: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  duration: number; // in minutes
  status: "not_started" | "in_progress" | "completed" | "draft";
  category?: string;
  createdAt: string;
  updatedAt: string;
  progress?: number; // 0-100
  questsCount?: number;
};
