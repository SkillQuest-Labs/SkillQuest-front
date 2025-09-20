import { useGetSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";

export const useDojoSessions = () => {
  const { user } = useUser();
  const userId = user?.id;

  const { sessions, loading } = useGetSessions(userId || "", true);

  // Filtrer les sessions non validées (disponibles pour le Dojo)
  const availableSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((session) => !session.isValidated);
  }, [sessions]);

  return {
    sessions: availableSessions,
    loading,
    hasSessions: availableSessions.length > 0,
  };
};
