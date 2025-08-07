import { useState } from "react";
import type { SessionFormType } from "../types/session-form.type";
import { isTimeSlotConflict, toMinutes } from "../utils/session.utils";

const initialForm: SessionFormType = {
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  endTime: "",
  linkedSkill: "",
  linkedQuest: "",
  color: "#3B82F6",
};

export const useSessionForm = () => {
  const [form, setForm] = useState<SessionFormType>(initialForm);

  const resetForm = (startDate: string = "") => {
    setForm({ ...initialForm, startDate });
  };

  const isValid = () => {
    return form.title.trim() && form.startDate && form.startTime && form.endTime && form.linkedQuest;
  };

  const hasTimeConflict = () => {
    return toMinutes(form.endTime) <= toMinutes(form.startTime);
  };

  const hasSessionConflict = (sessions: { startTime: string; endTime: string }[]) => {
    return isTimeSlotConflict(form.startTime, form.endTime, sessions);
  };

  return {
    form,
    setForm,
    resetForm,
    isValid,
    hasTimeConflict,
    hasSessionConflict,
  };
};
