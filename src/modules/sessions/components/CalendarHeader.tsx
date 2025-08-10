import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { CalendarApi } from "@fullcalendar/core";
import { useCallback } from "react";
import { Button } from "@/shared/components/ui/button";

type CalendarHeaderProps = {
  calendarApi: CalendarApi | null;
  headerTitle: string;
  currentView: string;
  setCurrentView: (view: string) => void;
  updateHeaderTitle: () => void;
  onAddSession: () => void;
};

export const CalendarHeader = ({
  calendarApi,
  headerTitle,
  currentView,
  setCurrentView,
  updateHeaderTitle,
  onAddSession,
}: CalendarHeaderProps) => {
  const handleViewChange = useCallback(
    (viewName: string) => {
      setCurrentView(viewName);
      calendarApi?.changeView(viewName);
      updateHeaderTitle();
    },
    [calendarApi, setCurrentView, updateHeaderTitle],
  );

  const handlePrev = useCallback(() => {
    calendarApi?.prev();
    updateHeaderTitle();
  }, [calendarApi, updateHeaderTitle]);

  const handleNext = useCallback(() => {
    calendarApi?.next();
    updateHeaderTitle();
  }, [calendarApi, updateHeaderTitle]);

  const handleToday = useCallback(() => {
    calendarApi?.today();
    updateHeaderTitle();
  }, [calendarApi, updateHeaderTitle]);

  return (
    <div className="mb-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 border border-slate-700 rounded-2xl px-3 py-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-lg bg-slate-700 text-white hover:bg-slate-600 text-sm"
          >
            Aujourd&apos;hui
          </Button>

          <Button
            onClick={handlePrev}
            aria-label="Période précédente"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleNext}
            aria-label="Période suivante"
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="font-medium text-slate-100 text-sm md:text-base ml-1">{headerTitle}</div>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Changer la vue du calendrier"
            value={currentView}
            onChange={(e) => handleViewChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="timeGridDay">Jour</option>
            <option value="timeGridWeek">Semaine</option>
            <option value="dayGridMonth">Mois</option>
          </select>

          <Button
            onClick={onAddSession}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-black hover:bg-gray-200 text-sm"
          >
            <Plus className="h-4 w-4 text-black" />
            <span className="hidden sm:inline">Nouvelle session</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
