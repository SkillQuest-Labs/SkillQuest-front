import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, Check } from "lucide-react";
import { useGetSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";
import { routes } from "@/routes/router.const";
import type { Session } from "@/shared/services/session/api-session.type";

interface WeeklySessionsReminderProps {
  className?: string;
}

const formatTime = (timeString: string): string => {
  // Si c'est un timestamp ISO, extraire seulement l'heure
  if (timeString.includes("T")) {
    const date = new Date(timeString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  // Si c'est déjà au format HH:MM, le retourner tel quel
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const formatDateWithTime = (dateString: string, timeString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const time = formatTime(timeString);

  if (date.toDateString() === today.toDateString()) {
    return `Aujourd'hui ${time}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Demain ${time}`;
  } else {
    // Pour toutes les autres dates, utiliser le format relatif
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === -1) {
      return `Hier ${time}`;
    } else if (diffDays > 1) {
      return `Dans ${diffDays} jours ${time}`;
    } else {
      return `Il y a ${Math.abs(diffDays)} jours ${time}`;
    }
  }
};

const getSessionStatus = (session: Session): "upcoming" | "today" | "past" => {
  const now = new Date();
  const sessionDate = new Date(session.date);
  const sessionDateTime = new Date(`${session.date}T${session.startTime}`);

  if (sessionDate.toDateString() === now.toDateString()) {
    return sessionDateTime > now ? "today" : "past";
  } else if (sessionDate > now) {
    return "upcoming";
  } else {
    return "past";
  }
};

export const WeeklySessionsReminder = ({ className = "" }: WeeklySessionsReminderProps) => {
  const { user } = useUser();
  const { sessions, isPending, error } = useGetSessions(user?.id || "");
  const navigate = useNavigate();

  const weeklySessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lundi

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche

    return sessions
      .filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          return a.startTime.localeCompare(b.startTime);
        }
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5); // Limiter à 5 sessions pour l'espace disponible
  }, [sessions]);

  if (isPending) {
    return (
      <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Sessions de la semaine</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-400 text-sm">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Sessions de la semaine</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-400 text-sm">Erreur de chargement</div>
        </div>
      </div>
    );
  }

  if (weeklySessions.length === 0) {
    return (
      <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Sessions de la semaine</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Calendar className="w-8 h-8 text-slate-500 mb-2" />
          <p className="text-slate-400 text-sm">Aucune session planifiée</p>
          <p className="text-slate-500 text-xs mt-1">Planifiez vos sessions pour commencer !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-3 flex flex-col h-full ${className}`}>
      {/* En-tête */}
      <div className="flex items-center gap-1.5 mb-2 flex-shrink-0">
        <div className="p-1 rounded-md bg-blue-500/20 border border-blue-400/30">
          <Calendar className="w-3 h-3 text-blue-400" />
        </div>
        <h3 className="text-xs font-semibold text-white">Sessions de la semaine</h3>
      </div>

      {/* Liste des sessions - Prend l'espace disponible */}
      <div className="space-y-1 flex-1 min-h-0 overflow-y-auto">
        {weeklySessions.map((session) => {
          const status = getSessionStatus(session);
          const isCompleted = status === "past";

          return (
            <div
              key={session.id}
              className="group p-2 rounded-md bg-slate-800/40 border border-slate-600/30 hover:bg-slate-800/60 hover:border-slate-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Statut de completion et contenu principal */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* Point de notification */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-3 h-3 rounded-full bg-slate-500/50 flex items-center justify-center">
                        <Check className="w-2 h-2 text-slate-300" />
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-blue-400"></div>
                    )}
                  </div>

                  {/* Contenu principal */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-medium truncate ${isCompleted ? "text-slate-400" : "text-white"}`}>
                      {session.title}
                    </h4>
                    <p className="text-xs text-slate-400">{formatDateWithTime(session.date, session.startTime)}</p>
                  </div>
                </div>

                {/* Badge de durée */}
                <div className="flex-shrink-0 ml-2">
                  <div
                    className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      isCompleted ? "bg-slate-600/50 text-slate-400" : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {Math.round(session.duration / 60)}h
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lien vers le calendrier complet */}
      <div className="mt-2 pt-2 border-t border-slate-600/20 flex-shrink-0">
        <button
          className="w-full flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => navigate(routes.workSession.path)}
        >
          Voir le calendrier complet
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
