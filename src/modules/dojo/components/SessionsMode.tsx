import React from "react";
import type { Session } from "@/shared/services/session/api-session.type";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, Target, Play } from "lucide-react";
import { getDateToTime } from "@/modules/sessions/utils/session.utils";

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
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Sessions Planifiées</h2>
        <p className="text-gray-400 text-sm">Choisissez une session de travail à lancer dans le Dojo</p>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer"
            onClick={() => onSelectSession(session)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: session.color }} />
                  <div>
                    <CardTitle className="text-white text-lg">{session.linkedSkill.title}</CardTitle>
                    <CardDescription className="text-gray-400">{session.title}</CardDescription>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSession(session);
                  }}
                  className="bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Lancer
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {getDateToTime(session.startTime)} - {getDateToTime(session.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{session.quests.length} quêtes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.quests.map((quest, index) => (
                    <Badge key={quest.id || index} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {quest.quest?.title || quest.title}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
