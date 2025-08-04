export interface CreateSessionInput {
  startDate: string;
  startTime: string;
  endTime: string;
  userId: string;
  questId: string;
  difficultyScore?: number;
  focusLevel?: number;
}

export interface CreateSessionResponse {
  id: string;
  date: string;
  duration: string;
  createdAt: string;
  difficultyScore?: number;
  focusLevel?: number;
  userId: string;
  quests: {
    id: string;
    questId: string;
    workSessionId: string;
  }[];
}
