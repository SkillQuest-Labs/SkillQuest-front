import type { SessionFormType, SessionPayload } from "../types/session-form.type";

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

export const INITIAL_FORM: SessionFormState = {
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  endTime: "",
  linkedSkill: "",
  linkedQuest: "",
  color: "#3B82F6",
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

export const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const isTimeSlotConflict = (
  start: string,
  end: string,
  otherSessions: { startTime: string; endTime: string }[],
): boolean => {
  const startMin = convertToMinutes(start);
  const endMin = convertToMinutes(end);
  return otherSessions.some((s) => {
    const sMin = convertToMinutes(s.startTime);
    const eMin = convertToMinutes(s.endTime);
    return startMin < eMin && endMin > sMin;
  });
};

export const buildSessionPayload = (form: SessionFormType): SessionPayload => {
  return {
    date: form.startDate,
    startTime: new Date(`${form.startDate}T${form.startTime}`).toISOString(),
    endTime: new Date(`${form.startDate}T${form.endTime}`).toISOString(),
    userId: "uuid-user-1234-5678-9012-345678901234",
    questId: form.linkedQuest,
    title: form.title,
    description: form.description,
    color: form.color,
    linkedSkillId: form.linkedSkill,
  };
};

export const convertCalendarEventsToDialogSessions = (
  calendarEvents: CalendarEvent[],
  selectedStartDate: string,
  indexOfEventBeingEdited: number | null,
) => {
  return calendarEvents
    .filter((calendarEvent, eventIndex) => {
      const eventStartDate = calendarEvent.start.slice(0, 10);
      return eventIndex !== indexOfEventBeingEdited && eventStartDate === selectedStartDate;
    })
    .map((calendarEvent) => {
      return {
        startDate: calendarEvent.start.slice(0, 10),
        startTime: calendarEvent.start.slice(11, 16),
        endTime: calendarEvent.end.slice(11, 16),
      };
    });
};
