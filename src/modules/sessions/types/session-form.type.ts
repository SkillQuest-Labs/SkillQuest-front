import type { Quest } from "@/shared/types/quest.type";
import type { Skill } from "@/shared/types/skill.type";

export interface SessionFormType {
  title: string;
  startDate: string;
  startTime: string;
  endTime: string;
  linkedSkill: string;
  linkedQuests: { id: string; title: string }[];
  color: string;
}

export interface SessionFormProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  skills: Skill[];
  quests: Quest[];
  loadingSkills: boolean;
  loadingQuests: boolean;
  disabled?: boolean;
}

export type CalendarEvent = {
  id: string;
  title: string;
  color: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  className?: string;
  extendedProps: {
    linkedSkill: string;
    isValidated: boolean;
    linkedQuests: { id: string; title: string }[];
  };
};

export type SessionFilterValue = {
  skillTitle: string;
  questTitle: string;
  date: string;
};
