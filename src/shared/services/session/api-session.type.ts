export type CreateSessionInput = {
  startDate: string;
  startTime: string;
  endTime: string;
  userId: string;
  questIds: string[];
  title: string;
  color: string;
  linkedSkillId: string;
};

export type CreateSessionResponse = Partial<Session> & {
  quests: {
    title?: string;
    id: string;
    questId: string;
    workSessionId: string;
    quest?: {
      title: string;
    };
  };
};

export type UpdateSessionInput = Partial<CreateSessionInput>;
export type UpdateSessionResponse = CreateSessionResponse;

export type Session = {
  id: string;
  title: string;
  color: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  userId: string;
  linkedSkillId: string;
  totalXpEarned: number;
  isValidated: boolean;
  linkedSkill: {
    title: string;
  };
  quests: {
    title: string;
    id: string;
    questId: string;
    workSessionId: string;
    quest: {
      title: string;
      description?: string;
      status: string;
    };
  }[];
};

export type Sessions = Session[];

export type SessionsQuery = {
  skill?: string;
  quest?: string;
  date?: string;
  limit?: number;
  page?: number;
  includeValidated?: boolean;
};

export type ListSessionsResponse = {
  items: Session[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};

export type QuestData = {
  id: string;
  title: string;
};

export type ValidateSessionDto = {
  sessionId: string;
  completedQuests: QuestData[];
};

export type ValidateSessionResponse = {
  success: boolean;
  message: string;
  xpGained: number;
  newLevel: number;
  xpToNextLevel: number;
  levelUp: boolean;
  currentXp: number;
  xpForCurrentLevel: number;
};
