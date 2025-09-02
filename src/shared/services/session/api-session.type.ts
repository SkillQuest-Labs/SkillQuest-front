export type CreateSessionInput = {
  startDate: string;
  startTime: string;
  endTime: string;
  userId: string;
  questIds: string[];
  title: string;
  description?: string;
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
  description: string;
  color: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  userId: string;
  linkedSkillId: string;
  quests: {
    title: string;
    id: string;
    questId: string;
    workSessionId: string;
    quest: {
      title: string;
    };
  }[];
};

export type Sessions = Session[];
