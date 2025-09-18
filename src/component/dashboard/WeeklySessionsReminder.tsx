import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, BookOpen, ChevronRight } from "lucide-react";
import { useGetSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";
import { routes } from "@/routes/router.const";
import type { Session } from "@/shared/services/session/api-session.type";

interface WeeklySessionsReminderProps {
  className?: string;
}

const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain";
  } else {
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
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

const getStatusColor = (status: "upcoming" | "today" | "past") => {
  switch (status) {
    case "today":
      return "text-orange-400 bg-orange-400/20 border-orange-400/30";
    case "upcoming":
      return "text-blue-400 bg-blue-400/20 border-blue-400/30";
    case "past":
      return "text-slate-400 bg-slate-400/20 border-slate-400/30";
  }
};

const getStatusLabel = (status: "upcoming" | "today" | "past") => {
  switch (status) {
    case "today":
      return "Aujourd'hui";
    case "upcoming":
      return "À venir";
    case "past":
      return "Terminé";
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
    <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
          <Calendar className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Sessions de la semaine</h3>
      </div>

      {/* Liste des sessions */}
      <div className="space-y-2">
        {weeklySessions.map((session) => {
          const status = getSessionStatus(session);
          const isPast = status === "past";

          return (
            <div
              key={session.id}
              className={`group p-2 rounded-md border transition-all duration-200 ${
                isPast
                  ? "bg-slate-700/20 border-slate-600/20 opacity-60"
                  : "bg-slate-700/30 border-slate-600/20 hover:bg-slate-700/50 hover:border-slate-500/30"
              }`}
            >
              <div className="flex items-start justify-between">
                {/* Informations principales */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-xs font-medium truncate ${isPast ? "text-slate-400" : "text-white"}`}>
                      {session.title}
                    </h4>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                  </div>

                  {/* Compétence liée */}
                  {session.linkedSkill && (
                    <div className="flex items-center gap-1 mb-1">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400 truncate">{session.linkedSkill.title}</span>
                    </div>
                  )}

                  {/* Date et heure */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(session.date)}
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(session.startTime)} - {formatTime(session.endTime)}
                    </div>
                  </div>
                </div>

                {/* Indicateur de durée */}
                <div className="flex-shrink-0 ml-2">
                  <div
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isPast ? "bg-slate-600/50 text-slate-400" : "bg-blue-500/20 text-blue-400"
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
      <div className="mt-4 pt-4 border-t border-slate-600/20">
        <button
          className="w-full flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => navigate(routes.workSession.path)}
        >
          Voir le calendrier complet
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
