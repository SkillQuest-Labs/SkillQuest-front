import React from "react";
import type { Session } from "@/shared/services/session/api-session.type";
import { Button } from "@/shared/components/ui/button";
import { Target, Play } from "lucide-react";

interface SessionsModeProps {
  sessions: Session[];
  loading: boolean;
  onSelectSession: (session: Session) => void;
}

export const SessionsMode: React.FC<SessionsModeProps> = ({ sessions, loading, onSelectSession }) => {
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

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-3 hover:bg-slate-600/30 transition-colors cursor-pointer"
            onClick={() => onSelectSession(session)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: session.color }} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm truncate">{session.linkedSkill.title}</h4>
                  <p className="text-gray-400 text-xs truncate">{session.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="text-xs text-gray-400">
                  {session.duration}min
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSession(session);
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
  );
};
