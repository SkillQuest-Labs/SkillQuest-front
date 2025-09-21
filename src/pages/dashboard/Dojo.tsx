import { useDojoMedia } from "@/modules/dojo/hooks/useDojoMedia";
import { useDojoSessions } from "@/modules/dojo/hooks/useDojoSessions";
import { SessionsMode } from "@/modules/dojo/components/SessionsMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import type { Session } from "@/shared/services/session/api-session.type";

export const Dojo = () => {
  const navigate = useNavigate();

  const { currentEnvironment, environments, changeEnvironment } = useDojoMedia();
  const { sessions, loading: sessionsLoading } = useDojoSessions();

  const handleLaunchImmersive = (session: Session) => {
    navigate(`${routes.dojoImmersive.path}/${session.id}`);
  };

  const handleSelectEnvironment = (environmentId: string) => {
    changeEnvironment(environmentId);
  };

  const handleGoToSessions = () => {
    navigate(routes.sessionsListing.path);
  };

  return (
    <div className="h-screen flex flex-col p-6">
      {/* Header fixe */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Dojo</h1>
          <p className="text-gray-400 text-sm">Espace d'entraînement immersif</p>
        </div>
        <Button
          onClick={handleGoToSessions}
          variant="outline"
          size="sm"
          className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Sessions
        </Button>
      </div>

      {/* Contenu principal avec hauteur fixe */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Colonne gauche - Sessions planifiées */}
        <div className="flex flex-col space-y-4 min-h-0">
          <Card className="bg-slate-800 border-slate-700 flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3 flex-shrink-0">
              <CardTitle className="text-white text-lg">Sessions Planifiées</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Sélectionnez une session pour commencer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex-1 min-h-0">
              <SessionsMode
                sessions={sessions}
                loading={sessionsLoading}
                onLaunchSession={handleLaunchImmersive}
              />
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Biomes immersifs */}
        <div className="flex flex-col">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Biomes Immersifs</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Choisissez l'ambiance de votre apprentissage
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {/* Grille compacte avec 4 cartes par ligne */}
              <div className="grid grid-cols-4 gap-3">
                {environments.map((environment) => (
                  <div
                    key={environment.id}
                    className={`bg-slate-700/30 border border-slate-600/50 rounded-lg p-2 transition-all duration-200 cursor-pointer hover:bg-slate-600/40 hover:border-slate-500/70 hover:scale-105 ${
                      currentEnvironment.id === environment.id
                        ? "ring-2 ring-blue-500/70 bg-blue-900/30 border-blue-500/50 shadow-lg shadow-blue-500/20"
                        : ""
                    }`}
                    onClick={() => handleSelectEnvironment(environment.id)}
                  >
                    <div className="aspect-square rounded-md overflow-hidden mb-2 shadow-inner">
                      {environment.videoUrl.endsWith(".mp4") ? (
                        <video
                          src={environment.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img src={environment.videoUrl} alt={environment.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <h4 className="text-white text-xs font-medium text-center truncate leading-tight">
                      {environment.name}
                    </h4>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
