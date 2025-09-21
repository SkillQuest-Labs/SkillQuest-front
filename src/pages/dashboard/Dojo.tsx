import { useState } from "react";
import { useDojoMedia } from "@/modules/dojo/hooks/useDojoMedia";
import { useDojoSessions } from "@/modules/dojo/hooks/useDojoSessions";
import { SessionsMode } from "@/modules/dojo/components/SessionsMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Play, Target, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import type { Session } from "@/shared/services/session/api-session.type";

export const Dojo = () => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const { currentEnvironment, environments, changeEnvironment } = useDojoMedia();
  const { sessions, loading: sessionsLoading } = useDojoSessions();

  const handleLaunchImmersive = () => {
    if (selectedSession) {
      navigate(`${routes.dojoImmersive.path}/${selectedSession.id}`);
    }
  };

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
  };

  const handleSelectEnvironment = (environmentId: string) => {
    changeEnvironment(environmentId);
  };

  const handleGoToSessions = () => {
    navigate(routes.sessionsListing.path);
  };

  const canLaunchDojo = selectedSession !== null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dojo</h1>
          <p className="text-gray-400 mt-2">Espace d'entraînement immersif</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGoToSessions}
            variant="outline"
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sessions
          </Button>
          <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche - Sessions planifiées */}
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Target className="w-5 h-5" />
                Sessions Planifiées
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Sélectionnez une session pour commencer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <SessionsMode
                sessions={sessions}
                loading={sessionsLoading}
                onLaunchSession={handleLaunchImmersive}
                onSelectSession={handleSelectSession}
              />
            </CardContent>
          </Card>

          {/* Résumé de la sélection */}
          {canLaunchDojo && selectedSession && (
            <Card className="bg-green-900/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-400" />
                    <h3 className="text-green-400 font-medium">Prêt à lancer</h3>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{selectedSession.linkedSkill.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {selectedSession.quests.length} quêtes • {selectedSession.duration} min
                    </p>
                  </div>
                  <Button
                    onClick={handleLaunchImmersive}
                    size="sm"
                    className="w-full bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Lancer le Dojo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne droite - Environnements immersifs */}
        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">
                Biomes Immersifs
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                Choisissez l'ambiance de votre apprentissage
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                {environments.map((environment) => (
                  <Card
                    key={environment.id}
                    className={`bg-slate-700/50 border-slate-600/50 transition-all cursor-pointer hover:bg-slate-600/50 ${
                      currentEnvironment.id === environment.id ? "ring-2 ring-blue-500/50 bg-blue-900/20" : ""
                    }`}
                    onClick={() => handleSelectEnvironment(environment.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Image/Video miniature */}
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-600/50 flex items-center justify-center">
                          {environment.videoUrl.endsWith(".mp4") ? (
                            <video
                              src={environment.videoUrl}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={environment.videoUrl}
                              alt={environment.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Titre et description */}
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">{environment.name}</h4>
                          <p className="text-gray-400 text-xs line-clamp-2">{environment.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
