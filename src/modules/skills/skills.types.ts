export enum SkillDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export type Skill = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: SkillDifficulty;
  createdAt: string; // ISO date
}; 