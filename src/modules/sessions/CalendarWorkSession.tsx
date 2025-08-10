import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "@/styles/calendar.css";
import { SessionDialog } from "./components/SessionDialog";
import { useCreateSession } from "@/shared/services/session/api-session";
import { CalendarHeader } from "./components/CalendarHeader";
import {
  convertDateToHourMinute,
  convertDateToISODate,
  capitalizeFirstLetter,
  convertToUtcIso,
} from "./utils/date.utils";
import { useCalendarResponsive } from "./hooks/useCalendarResponsive";
import {
  type SessionFormState,
  INITIAL_FORM,
  type CalendarEvent,
  convertCalendarEventsToDialogSessions,
} from "./utils/session.utils";

export const CalendarWorkSession = () => {
  const { isCollapsed } = useSidebarStore();
  const { createSession } = useCreateSession();

  const calendarRef = useRef<FullCalendar | null>(null);

  const [workSessions, setWorkSessions] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [sessionForm, setSessionForm] = useState<SessionFormState>(INITIAL_FORM);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const initialView = useCalendarResponsive();

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
    const start = selectionInfo.start as Date;
    const end = selectionInfo.end as Date;
    setEditingIndex(null);
    setSessionForm({
      ...INITIAL_FORM,
      startDate: convertDateToISODate(start),
      startTime: convertDateToHourMinute(start),
      endTime: convertDateToHourMinute(end),
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
        ...INITIAL_FORM,
        startDate: convertDateToISODate(start),
        startTime: convertDateToHourMinute(start),
        endTime: convertDateToHourMinute(end),
      });
    } else {
      setSessionForm({ ...INITIAL_FORM, startDate: info.dateStr });
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
        userId: "uuid-user-1234-5678-9012-345678901234",
        startDate: sessionForm.startDate,
        startTime: convertToUtcIso(sessionForm.startDate, sessionForm.startTime),
        endTime: convertToUtcIso(sessionForm.startDate, sessionForm.endTime),
      };

      const eventForCalendar: CalendarEvent = {
        id: crypto.randomUUID(),
        title: payloadForApi.title,
        description: payloadForApi.description,
        color: payloadForApi.color,
        start: payloadForApi.startTime,
        end: payloadForApi.endTime,
        backgroundColor: payloadForApi.color,
        borderColor: payloadForApi.color,
        extendedProps: {
          linkedSkill: sessionForm.linkedSkill,
          linkedQuest: sessionForm.linkedQuest,
        },
      };

      if (editingIndex !== null) {
        const next = [...workSessions];

        eventForCalendar.id = next[editingIndex].id;
        next[editingIndex] = { ...next[editingIndex], ...eventForCalendar };
        setWorkSessions(next);
      } else {
        const created = await createSession(payloadForApi as any);
        if (created?.id) {
          eventForCalendar.id = String(created.id);
        }
        setWorkSessions((prev) => [...prev, eventForCalendar]);
      }

      setIsDialogOpen(false);
      setEditingIndex(null);
      setSessionForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
    }
  }, [editingIndex, sessionForm, workSessions, createSession]);

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
            setSessionForm(INITIAL_FORM);
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
        sessions={convertCalendarEventsToDialogSessions(workSessions, sessionForm.startDate, editingIndex)}
      />
    </div>
  );
};
