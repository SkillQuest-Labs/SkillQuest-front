export interface CreateSessionInput {
  startDate: string;
  startTime: string;
  endTime: string;
  userId: string;
  questId: string;
  title: string;
  description?: string;
  color: string;
  linkedSkillId: string;
  difficultyScore?: number;
  focusLevel?: number;
}

export interface CreateSessionResponse {
  id: string;
  title: string;
  description?: string;
  color: string;
  date: string;
  duration: string;
  createdAt: string;
  difficultyScore?: number;
  focusLevel?: number;
  userId: string;
  linkedSkillId: string;
  quests: {
    id: string;
    questId: string;
    workSessionId: string;
  }[];
}
