import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight, CheckCircle, PlayCircle, Circle } from "lucide-react";
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

const getStatusIcon = (status: "upcoming" | "today" | "past") => {
  switch (status) {
    case "today":
      return <PlayCircle className="w-3 h-3 text-orange-400" />;
    case "upcoming":
      return <Circle className="w-3 h-3 text-blue-400" />;
    case "past":
      return <CheckCircle className="w-3 h-3 text-slate-400" />;
  }
};

export const WeeklySessionsReminder = ({ className = "" }: WeeklySessionsReminderProps) => {
  const { user } = useUser();
  const { sessions, isPending, error } = useGetSessions(user?.id || "");
  const navigate = useNavigate();

  const weeklySessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];

    const now = new Date();

    return sessions
      .filter((session) => {
        try {
          // Vérifier que la date et l'heure sont valides
          if (!session.date || !session.startTime) return false;

          // Les données viennent déjà au format ISO complet
          const sessionDateTime = new Date(session.startTime);

          // Vérifier que la date est valide
          if (isNaN(sessionDateTime.getTime())) {
            console.warn("Date invalide pour la session:", session.title, session.date, session.startTime);
            return false;
          }

          // Filtrer les sessions futures
          return sessionDateTime > now;
        } catch (error) {
          console.warn("Erreur lors du traitement de la session:", session.title, error);
          return false;
        }
      })
      .sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        // Tri croissant pour avoir les plus proches en premier
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3);
  }, [sessions]);

  if (isPending) {
    return (
      <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Prochaines sessions</h3>
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
          <h3 className="text-lg font-semibold text-white">Prochaines sessions</h3>
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
          <h3 className="text-lg font-semibold text-white">Prochaines sessions</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Calendar className="w-8 h-8 text-slate-500 mb-2" />
          <p className="text-slate-400 text-sm">Aucune prochaine session</p>
          <p className="text-slate-500 text-xs mt-1">Planifiez vos sessions pour commencer !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/30 rounded-xl border border-slate-600/30 p-3 ${className}`}>
      {/* En-tête compact */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Prochaines sessions</h3>
      </div>

      {/* Liste des sessions simplifiée */}
      <div className="space-y-2">
        {weeklySessions.map((session) => {
          const status = getSessionStatus(session);
          const isPast = status === "past";

          return (
            <div
              key={session.id}
              className={`group p-2 rounded-md transition-colors ${
                isPast ? "bg-slate-700/20 opacity-60" : "bg-slate-700/30 hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {getStatusIcon(status)}
                    <h4 className={`text-xs font-medium truncate ${isPast ? "text-slate-400" : "text-white"}`}>
                      {session.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">{formatDate(session.date)}</span>
                    <span className="text-xs text-slate-400">{formatTime(session.startTime.split("T")[1])}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isPast ? "bg-slate-600/50 text-slate-400" : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {Math.round(session.duration / 60)}h
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lien compact */}
      <div className="mt-3 pt-2 border-t border-slate-600/20">
        <button
          className="w-full flex items-center justify-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          onClick={() => navigate(routes.workSession.path)}
        >
          Voir le calendrier
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
