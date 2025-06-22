export type Skill = {
  id: string;
  title: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  duration: number; // in minutes
  status: "draft" | "published";
};
