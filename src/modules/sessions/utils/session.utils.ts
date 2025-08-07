import type { SessionFormType, SessionPayload } from "../types/session-form.type";

export const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const isTimeSlotConflict = (
  start: string,
  end: string,
  otherSessions: { startTime: string; endTime: string }[],
): boolean => {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  return otherSessions.some((s) => {
    const sMin = toMinutes(s.startTime);
    const eMin = toMinutes(s.endTime);
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
