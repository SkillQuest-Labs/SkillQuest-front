import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "@/styles/calendar.css";
import { SessionDialog } from "./components/SessionDialog";
import {
  useCreateSession,
  useDeleteSession,
  useGetSessions,
  useUpdateSession,
} from "@/shared/services/session/api-session";
import { CalendarHeader } from "./components/CalendarHeader";
import { useCalendarResponsive } from "./hooks/useCalendarResponsive";
import {
  convertCalendarEventsToDialogSessions,
  capitalizeFirstLetter,
  convertToUtcIso,
  convertSessionsToEvents,
} from "./utils/session.utils";
import type { SessionFormType, CalendarEvent } from "./types/session-form.type";
import { INITIAL_SESSION_FORM } from "./const/session-form.const";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import { ConfirmDeleteDialogue } from "@/component/confirm-dialogue/ConfirmDeleteDialogue";
import { showToast } from "@/component/notification/show-toast";

export const CalendarWorkSession = () => {
  const { isCollapsed } = useSidebarStore();
  const { createSession } = useCreateSession();

  const calendarRef = useRef<FullCalendar | null>(null);

  const [workSessions, setWorkSessions] = useState<CalendarEvent[]>([]);
  const [currentView, setCurrentView] = useState<string>("dayGridMonth");
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [sessionForm, setSessionForm] = useState<SessionFormType>(INITIAL_SESSION_FORM);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const editingSessionId = editingIndex !== null ? workSessions[editingIndex]?.id : "";

  const { sessions } = useGetSessions("uuid-user-1234-5678-9012-345678901234"); //user id need be to be change
  const { updateSession } = useUpdateSession(editingSessionId);
  const { deleteSession } = useDeleteSession();

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

  const handleSelect = useCallback((arg: DateSelectArg) => {
    const { startStr, endStr } = arg;
    setEditingIndex(null);
    setSessionForm({
      ...INITIAL_SESSION_FORM,
      startDate: startStr,
      startTime: startStr,
      endTime: endStr,
    });
    setIsDialogOpen(true);
  }, []);

  const handleDateClick = useCallback((arg: DateClickArg) => {
    const { date, dateStr, view } = arg;
    setEditingIndex(null);

    if (view.type.startsWith("timeGrid")) {
      const start = dateStr;
      const endTimeIso = new Date(date.getTime() + 30 * 60 * 1000).toISOString();

      setSessionForm({
        ...INITIAL_SESSION_FORM,
        startDate: start.slice(0, 10),
        startTime: start.slice(11, 16),
        endTime: endTimeIso.slice(11, 16),
      });
    } else {
      setSessionForm({ ...INITIAL_SESSION_FORM, startDate: dateStr.slice(0, 10) });
    }
    setIsDialogOpen(true);
  }, []);

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const id = clickInfo.event.id;
      const index = workSessions.findIndex((e) => e.id === id);
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
        linkedQuests: selected.extendedProps?.linkedQuests,
        color: selected.backgroundColor ?? "#3B82F6",
      });
      setIsDialogOpen(true);
    },
    [workSessions],
  );

  const calendarEvents = useMemo(() => workSessions, [workSessions]);

  const handleSave = useCallback(async () => {
    try {
      const startIsoUtc = convertToUtcIso(sessionForm.startDate, sessionForm.startTime);
      const endIsoUtc = convertToUtcIso(sessionForm.startDate, sessionForm.endTime);

      const payload = {
        title: sessionForm.title,
        description: sessionForm.description,
        color: sessionForm.color,
        linkedSkillId: sessionForm.linkedSkill,
        questIds: sessionForm.linkedQuests.map((linkedQuest) => linkedQuest.id),
        userId: "uuid-user-1234-5678-9012-345678901234", // user id need be to change
        startDate: sessionForm.startDate,
        startTime: startIsoUtc,
        endTime: endIsoUtc,
      };

      if (editingIndex === null) {
        await createSession(payload);
      } else {
        const idToUpdate = workSessions[editingIndex]?.id;
        if (!idToUpdate) throw new Error("Session id introuvable");
        await updateSession(payload);
      }

      setIsDialogOpen(false);
      setEditingIndex(null);
      setSessionForm(INITIAL_SESSION_FORM);

      showToast({
        title: "Succès",
        description: "Session sauvegardé",
        status: "success",
      });
    } catch {
      showToast({
        title: "Erreur",
        description: "Erreur lors de sauvegarde de la session",
        status: "error",
      });
    }
  }, [sessionForm, editingIndex, workSessions, createSession, updateSession]);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteSession(editingSessionId);

      setWorkSessions((workSession) => workSession.filter((_, i) => i !== editingIndex));

      setIsDialogOpen(false);
      setEditingIndex(null);
      setSessionForm(INITIAL_SESSION_FORM);
      setIsDeleteDialogOpen(false);

      showToast({
        title: "Succès",
        description: "La session a été supprimé avec succès",
        status: "success",
      });
    } catch {
      showToast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la session",
        status: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  }, [deleteSession, editingSessionId, editingIndex]);

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
              timeZone="UTC"
            />
          </div>
        </div>
      </div>

      <SessionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formSession={sessionForm}
        setFormSession={setSessionForm}
        onSave={handleSave}
        isEditing={editingIndex !== null}
        sessionSlots={convertCalendarEventsToDialogSessions(workSessions, sessionForm.startDate, editingIndex)}
        editingSessionId={editingSessionId}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
      />

      <ConfirmDeleteDialogue
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        messageDialogue="Êtes-vous sûr de vouloir supprimer la session ? Cette action est irréversible."
        handleConfirmDelete={handleDelete}
      />
    </div>
  );
};
