import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import type { CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import "@/styles/calendar.css";
import { SessionDialog } from "./components/SessionDialog";

export const CalendarWorkSession = () => {
  const initFormState = {
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endTime: "",
    linkedQuest: "",
    color: "#3B82F6",
  };

  const { isCollapsed } = useSidebarStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [form, setForm] = useState(initFormState);
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const calendarApi: CalendarApi | undefined = calendarRef.current?.getApi();
      calendarApi?.updateSize();
    }, 300);
    return () => clearTimeout(timeout);
  }, [isCollapsed]);

  const handleDateClick = (arg: any) => {
    setForm({ ...initFormState, startDate: arg.dateStr });
    setEditingIndex(null);
    setIsOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const index = sessions.findIndex((s) => s.title === clickInfo.event.title && s.date === clickInfo.event.startStr);
    if (index !== -1) {
      const session = sessions[index];
      setForm({
        title: session.title,
        description: session.description,
        startDate: session.startDate || session.date,
        startTime: session.startTime || "",
        endTime: session.endTime || "",
        linkedQuest: session.linkedQuest || "",
        color: session.color || "#3B82F6",
      });
      setEditingIndex(index);
      setIsOpen(true);
    }
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.startDate || !form.startTime || !form.endTime || !form.linkedQuest) return;

    const sessionData = {
      ...form,
      date: form.startDate, // fullcalendar date
    };

    if (editingIndex !== null) {
      const updated = [...sessions];
      updated[editingIndex] = sessionData;
      setSessions(updated);
    } else {
      setSessions([...sessions, sessionData]);
    }

    setForm(initFormState);
    setIsOpen(false);
    setEditingIndex(null);
  };

  return (
    <div
      className={`transition-all duration-300 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen ${isCollapsed ? "pl-20" : "pl-64"}`}
    >
      <div className="p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-bold text-white mb-4">Vos sessions de travail</h1>
        <div className="bg-slate-800 rounded-xl p-4 shadow-xl text-white flex-grow">
          <FullCalendar
            ref={calendarRef}
            locale={frLocale}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={sessions.map((session) => ({
              title: session.title,
              date: session.date,
              color: session.color, // ✅ appliquer la couleur
            }))}
            height="auto"
          />
        </div>
      </div>
      <SessionDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        isEditing={editingIndex !== null}
      />
    </div>
  );
};
