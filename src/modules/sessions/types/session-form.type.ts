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
