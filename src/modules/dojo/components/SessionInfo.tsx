import React from "react";
import { Clock, Calendar, Target } from "lucide-react";
import type { Session } from "@/shared/services/session/api-session.type";

interface SessionInfoProps {
  session: Session;
  sessionTimeLeft?: number;
  isSessionActive?: boolean;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({ session, sessionTimeLeft, isSessionActive }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = () => {
    if (isSessionActive && sessionTimeLeft !== undefined) {
      const minutes = Math.floor(sessionTimeLeft / 60);
      const seconds = sessionTimeLeft % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ""}`;
    }
    return `${diffMinutes}min`;
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/30 text-white rounded-lg px-4 py-2 flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Target className="w-3 h-3 text-white/80" />
        <span className="text-xs font-medium text-white/80">{session.linkedSkill.title}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-3 h-3 text-white/80" />
        <span className="text-xs font-medium text-white/80">{getDuration()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar className="w-3 h-3 text-white/80" />
        <span className="text-xs font-medium text-white/80">{formatDate(session.startTime)}</span>
      </div>
    </div>
  );
};
