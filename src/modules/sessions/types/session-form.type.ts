export interface SessionFormType {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  linkedSkill: string;
  linkedQuest: string;
  color: string;
}

export interface SessionFormWithId extends SessionFormType {
  id: string;
  date: string;
}

export interface SessionPayload {
  date: string;
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

export interface SessionFormProps {
  form: SessionFormType;
  setForm: (form: SessionFormType) => void;
  skills: any[];
  quests: any[];
  loadingSkills: boolean;
  loadingQuests: boolean;
}

export type SessionFormState = {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  linkedSkill: string;
  linkedQuest: string;
  color: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  color: string;
  start: string; // ISO
  end: string; // ISO
  backgroundColor: string;
  borderColor: string;
  extendedProps?: {
    linkedSkill?: string;
    linkedQuest?: string;
  };
};
