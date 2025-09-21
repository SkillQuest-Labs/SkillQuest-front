import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DojoImmersive } from "@/modules/dojo/components/DojoImmersive";
import { useDojoMedia } from "@/modules/dojo/hooks/useDojoMedia";
import { useDojoSessions } from "@/modules/dojo/hooks/useDojoSessions";
import { LoadingComponent } from "@/component/LoadingComponent";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { routes } from "@/routes/router.const";
import type { Session } from "@/shared/services/session/api-session.type";

export const DojoImmersivePage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentEnvironment, isBackgroundVisible } = useDojoMedia();
  const { sessions, loading: sessionsLoading } = useDojoSessions();

  // Charger la session correspondante
  useEffect(() => {
    if (!sessionId) {
      setError("ID de session manquant");
      setIsLoading(false);
      return;
    }

    if (sessionsLoading) {
      return;
    }

    if (!sessions) {
      setError("Impossible de charger les sessions");
      setIsLoading(false);
      return;
    }

    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setError(null);
    } else {
      setError("Session non trouvée");
    }
    setIsLoading(false);
  }, [sessionId, sessions, sessionsLoading]);

  const handleExit = () => {
    navigate(routes.dojo.path);
  };

  const handleSettings = () => {
    // TODO: Implémenter les paramètres du dojo
    console.log("Paramètres du dojo");
  };

  // États de chargement et d'erreur
  if (isLoading || sessionsLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center z-[9999]">
        <LoadingComponent />
      </div>
    );
  }

  if (error || !selectedSession) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center z-[9999]">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p className="text-gray-400 mb-6">{error || "Session non trouvée"}</p>
          <Button
            onClick={() => navigate(routes.dojo.path)}
            className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au Dojo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DojoImmersive
      environment={currentEnvironment}
      isBackgroundVisible={isBackgroundVisible}
      onExit={handleExit}
      onSettings={handleSettings}
      selectedSession={selectedSession}
    />
  );
};
