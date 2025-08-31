export interface SessionFormType {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  linkedSkill: string;
  linkedQuests: Array<{ id: string; title: string }>;
  color: string;
}

export interface SessionFormProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  skills: any[];
  quests: any[];
  loadingSkills: boolean;
  loadingQuests: boolean;
}

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  color: string;
  start: string; // ISO
  end: string; // ISO
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    linkedSkill: string;
    linkedQuests: Array<{ id: string; title: string }>;
  };
};
