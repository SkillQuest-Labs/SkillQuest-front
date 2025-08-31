import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "@/styles/calendar.css";
import { SessionDialog } from "./components/SessionDialog";
import { useCreateSession, useGetSessions } from "@/shared/services/session/api-session";
import { CalendarHeader } from "./components/CalendarHeader";
import { useCalendarResponsive } from "./hooks/useCalendarResponsive";
import {
  convertCalendarEventsToDialogSessions,
  convertDateToHourMinute,
  convertDateToISODate,
  capitalizeFirstLetter,
  convertToUtcIso,
  convertSessionsToEvents,
} from "./utils/session.utils";
import type { SessionFormState, CalendarEvent } from "./types/session-form.type";
import { INITIAL_SESSION_FORM } from "./const/session-form.const";

export const CalendarWorkSession = () => {
  const { isCollapsed } = useSidebarStore();
  const { createSession } = useCreateSession();
  const { sessions } = useGetSessions("uuid-user-1234-5678-9012-345678901234"); //user id need be to be change

  const calendarRef = useRef<FullCalendar | null>(null);

  const [workSessions, setWorkSessions] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [sessionForm, setSessionForm] = useState<SessionFormState>(INITIAL_SESSION_FORM);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const initialView = useCalendarResponsive();

  useEffect(() => {
    if (!sessions || !Array.isArray(sessions)) return;
    setWorkSessions(convertSessionsToEvents(sessions));
  }, [sessions]);

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    api.changeView(initialView);
  }, [initialView]);

  useEffect(() => {
    const t = setTimeout(() => calendarRef.current?.getApi().updateSize(), 250);
    return () => clearTimeout(t);
  }, [isCollapsed]);

  const handleDatesSet = useCallback((arg: any) => {
    setCurrentView(arg.view.type);
    setHeaderTitle(capitalizeFirstLetter(arg.view.title));
  }, []);

  const handleSelect = useCallback((selectionInfo: any) => {
    setEditingIndex(null);
    setSessionForm({
      ...INITIAL_SESSION_FORM,
      startDate: String(selectionInfo.start),
      startTime: String(selectionInfo.start),
      endTime: String(selectionInfo.end),
    });
    setIsDialogOpen(true);
  }, []);

  const handleDateClick = useCallback((info: any) => {
    const viewType = calendarRef.current?.getApi().view.type ?? "";
    setEditingIndex(null);

    if (viewType.startsWith("timeGrid")) {
      const start = new Date(info.date);
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      setSessionForm({
        ...INITIAL_SESSION_FORM,
        startDate: convertDateToISODate(start),
        startTime: convertDateToHourMinute(start),
        endTime: convertDateToHourMinute(end),
      });
    } else {
      setSessionForm({ ...INITIAL_SESSION_FORM, startDate: info.dateStr });
    }
    setIsDialogOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (clickInfo: any) => {
      const index = workSessions.findIndex((eventItem) => eventItem.id === clickInfo.event.id);
      if (index < 0) return;

      const selected = workSessions[index];
      setEditingIndex(index);
      setSessionForm({
        title: selected.title ?? "",
        description: selected.description ?? "",
        startDate: selected.start?.slice(0, 10) ?? "",
        startTime: selected.start?.slice(11, 16) ?? "",
        endTime: selected.end?.slice(11, 16) ?? "",
        linkedSkill: selected.extendedProps?.linkedSkill ?? "",
        linkedQuest: selected.extendedProps?.linkedQuest ?? "",
        color: selected.backgroundColor ?? "#3B82F6",
      });
      setIsDialogOpen(true);
    },
    [workSessions],
  );

  const calendarEvents = useMemo(() => workSessions, [workSessions]);

  const handleSave = useCallback(async () => {
    try {
      const payloadForApi = {
        title: sessionForm.title,
        description: sessionForm.description,
        color: sessionForm.color,
        linkedSkillId: sessionForm.linkedSkill,
        questId: sessionForm.linkedQuest,
        userId: "uuid-user-1234-5678-9012-345678901234", // user id need be to change
        startDate: sessionForm.startDate,
        startTime: convertToUtcIso(sessionForm.startDate, sessionForm.startTime),
        endTime: convertToUtcIso(sessionForm.startDate, sessionForm.endTime),
      };

      await createSession(payloadForApi as any);

      setIsDialogOpen(false);
      setEditingIndex(null);
      setSessionForm(INITIAL_SESSION_FORM);
    } catch (error) {
      console.error(error);
    }
  }, [sessionForm, createSession]);

  return (
    <div className="transition-all duration-300 min-h-screen">
      <div className="p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)] w-full">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 tracking-tight mb-4">
          Vos sessions de travail
        </h1>

        <CalendarHeader
          calendarApi={calendarRef.current?.getApi() || null}
          headerTitle={headerTitle}
          currentView={currentView}
          setCurrentView={(viewName) => calendarRef.current?.getApi().changeView(viewName)}
          updateHeaderTitle={() => {
            const api = calendarRef.current?.getApi();
            if (api) setHeaderTitle(capitalizeFirstLetter(api.view.title));
          }}
          onAddSession={() => {
            setEditingIndex(null);
            setSessionForm(INITIAL_SESSION_FORM);
            setIsDialogOpen(true);
          }}
        />

        <div className="rounded-2xl border border-slate-700 overflow-hidden bg-slate-900/60">
          <div className={currentView.startsWith("timeGrid") ? "h-[calc(100vh-220px)] overflow-auto" : ""}>
            <FullCalendar
              ref={calendarRef as any}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              locales={[frLocale]}
              locale="fr"
              initialView={initialView}
              datesSet={handleDatesSet}
              headerToolbar={false}
              events={calendarEvents}
              selectable
              selectMirror
              select={handleSelect}
              unselectAuto
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height={currentView.startsWith("timeGrid") ? "100%" : "auto"}
              contentHeight={currentView.startsWith("timeGrid") ? "auto" : undefined}
              expandRows={currentView.startsWith("timeGrid") ? undefined : false}
              allDaySlot={false}
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
              scrollTime="08:00:00"
              dayHeaderFormat={{ weekday: "long" }}
              eventDisplay="block"
              displayEventTime={false}
            />
          </div>
        </div>
      </div>

      <SessionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={sessionForm}
        setForm={setSessionForm}
        onSave={handleSave}
        isEditing={editingIndex !== null}
        sessionSlots={convertCalendarEventsToDialogSessions(workSessions, sessionForm.startDate, editingIndex)}
      />
    </div>
  );
};
