import type { CreateSessionInput, Sessions } from "@/shared/services/session/api-session.type";
import type { SessionFormType, CalendarEvent } from "../types/session-form.type";

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

export const buildSessionPayload = (sessionForm: SessionFormType, userId: string): CreateSessionInput => {
  const startIsoUtc = convertToUtcIso(sessionForm.startDate, sessionForm.startTime);
  const endIsoUtc = convertToUtcIso(sessionForm.startDate, sessionForm.endTime);
  return {
    startDate: sessionForm.startDate,
    startTime: startIsoUtc,
    endTime: endIsoUtc,
    userId: userId,
    questIds: (sessionForm.linkedQuests || []).map((quest) => quest.id),
    title: sessionForm.title,
    description: sessionForm.description,
    color: sessionForm.color,
    linkedSkillId: sessionForm.linkedSkill,
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
        linkedQuests: calendarEvent.extendedProps.linkedQuests,
      };
    });
};

export const capitalizeFirstLetter = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

export const convertToUtcIso = (date: string, time: string): string => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return utcDate.toISOString();
};

export const computeResponsiveView = () => {
  const w = window.innerWidth;
  if (w < 768) return "timeGridDay";
  if (w < 1024) return "timeGridWeek";
  return "dayGridMonth";
};

export const convertSessionsToEvents = (sessions: Sessions): CalendarEvent[] => {
  return sessions.map((session) => ({
    id: session.id,
    title: session.title,
    description: session.description ?? "",
    start: session.startTime,
    end: session.endTime,
    color: session.color ?? "#3B82F6",
    backgroundColor: session.color ?? "#3B82F6",
    borderColor: session.color ?? "#3B82F6",
    extendedProps: {
      linkedSkill: session.linkedSkillId ?? "",
      linkedQuests: Array.isArray(session.quests)
        ? session.quests.map((sessionQuest) => ({
            id: sessionQuest.questId ?? sessionQuest.id,
            title: sessionQuest.quest?.title ?? sessionQuest.title ?? "",
          }))
        : [],
    },
  }));
};
