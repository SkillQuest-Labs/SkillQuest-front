import React from "react";
import type { Session } from "@/shared/services/session/api-session.type";
import { Button } from "@/shared/components/ui/button";
import { Target, Play } from "lucide-react";

interface SessionsModeProps {
  sessions: Session[];
  loading: boolean;
  onLaunchSession: (session: Session) => void;
}

interface SessionGroup {
  title: string;
  sessions: Session[];
}

export const SessionsMode: React.FC<SessionsModeProps> = ({ sessions, loading, onLaunchSession }) => {
  // Fonction pour organiser les sessions par sections temporelles
  const organizeSessionsByTime = (sessions: Session[]): SessionGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay())); // Dimanche de cette semaine

    const todaySessions: Session[] = [];
    const weekSessions: Session[] = [];
    const laterSessions: Session[] = [];

    sessions.forEach((session) => {
      const sessionDate = new Date(session.startTime);
      const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

      if (sessionDateOnly.getTime() === today.getTime()) {
        todaySessions.push(session);
      } else if (sessionDateOnly > today && sessionDateOnly <= endOfWeek) {
        weekSessions.push(session);
      } else {
        laterSessions.push(session);
      }
    });

    // Trier chaque groupe par date (plus récente en premier)
    const sortByDate = (a: Session, b: Session) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime();

    todaySessions.sort(sortByDate);
    weekSessions.sort(sortByDate);
    laterSessions.sort(sortByDate);

    const groups: SessionGroup[] = [];

    if (todaySessions.length > 0) {
      groups.push({
        title: "Aujourd'hui",
        sessions: todaySessions,
      });
    }

    if (weekSessions.length > 0) {
      groups.push({
        title: "Cette semaine",
        sessions: weekSessions,
      });
    }

    if (laterSessions.length > 0) {
      groups.push({
        title: "Plus tard",
        sessions: laterSessions,
      });
    }

    return groups;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des sessions...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Aucune session planifiée</h3>
        <p className="text-gray-400">Créez des sessions de travail pour les voir apparaître ici.</p>
      </div>
    );
  }

  const sessionGroups = organizeSessionsByTime(sessions);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {sessionGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            {/* En-tête de section */}
            <div className="flex items-center space-x-2 sticky top-0 bg-slate-800/80 backdrop-blur-sm py-2 z-10">
              <h3 className="text-sm font-medium text-gray-300">{group.title}</h3>
              <div className="flex-1 h-px bg-gray-600/50"></div>
              <span className="text-xs text-gray-500">{group.sessions.length}</span>
            </div>

            {/* Sessions de la section */}
            <div className="space-y-2">
              {group.sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 hover:bg-slate-600/30 transition-colors cursor-pointer"
                  onClick={() => onLaunchSession(session)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: session.color }} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm truncate">{session.linkedSkill.title}</h4>
                        <p className="text-gray-400 text-xs truncate">{session.title}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>
                            {new Date(session.startTime)
                              .toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              .replace(",", "")}
                          </span>
                          <span>•</span>
                          <span>
                            {session.quests.length} quête{session.quests.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="text-xs text-gray-400">{session.duration}min</div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLaunchSession(session);
                        }}
                        size="sm"
                        className="bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30 h-7 px-2"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
