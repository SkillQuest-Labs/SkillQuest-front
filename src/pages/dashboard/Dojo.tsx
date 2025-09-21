import { useState } from "react";
import { DojoImmersive } from "@/modules/dojo/components/DojoImmersive";
import { useDojoMedia } from "@/modules/dojo/hooks/useDojoMedia";
import { useDojoSessions } from "@/modules/dojo/hooks/useDojoSessions";
import { useDojoQuests } from "@/modules/dojo/hooks/useDojoQuests";
import { SessionsMode } from "@/modules/dojo/components/SessionsMode";
import { FreeMode } from "@/modules/dojo/components/FreeMode";
import { EnvironmentSelector } from "@/modules/dojo/components/EnvironmentSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Portal } from "@/shared/components/ui/portal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Play, Clock, Target, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import type { Session } from "@/shared/services/session/api-session.type";

type DojoMode = "sessions" | "free";

export const Dojo = () => {
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [currentMode, setCurrentMode] = useState<DojoMode>("sessions");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  const { currentEnvironment, isBackgroundVisible, environments } = useDojoMedia();
  const { sessions, loading: sessionsLoading } = useDojoSessions();
  const { quests, selectedQuests, loading: questsLoading, toggleQuestSelection, clearSelection } = useDojoQuests();

  const handleLaunchImmersive = () => {
    setIsImmersiveMode(true);
  };

  const handleExitImmersive = () => {
    setIsImmersiveMode(false);
  };

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setCurrentMode("sessions");
  };

  const handleLaunchFreeSession = () => {
    if (selectedQuests.length > 0) {
      handleLaunchImmersive();
    }
  };

  const handleGoToSessions = () => {
    navigate(routes.sessionsListing.path);
  };

  const canLaunchDojo =
    (selectedSession && currentMode === "sessions") || (selectedQuests.length > 0 && currentMode === "free");

  if (isImmersiveMode) {
    return (
      <Portal>
        <DojoImmersive
          environment={currentEnvironment}
          isBackgroundVisible={isBackgroundVisible}
          onExit={handleExitImmersive}
          selectedSession={selectedSession}
          selectedQuests={currentMode === "free" ? selectedQuests : []}
          mode={currentMode}
        />
      </Portal>
    );
  }

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

      <div className="grid gap-6">
        {/* Sélection du mode */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6" />
              Mode de Travail
            </CardTitle>
            <CardDescription className="text-gray-400">
              Choisissez comment vous souhaitez travailler dans le Dojo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentMode} onValueChange={(value: string) => setCurrentMode(value as DojoMode)}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger
                  value="sessions"
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
                >
                  Sessions Planifiées
                </TabsTrigger>
                <TabsTrigger
                  value="free"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                >
                  Session Libre
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sessions" className="mt-6">
                <SessionsMode sessions={sessions} loading={sessionsLoading} onSelectSession={handleSelectSession} />
              </TabsContent>

              <TabsContent value="free" className="mt-6">
                <FreeMode
                  quests={quests}
                  selectedQuests={selectedQuests}
                  loading={questsLoading}
                  onToggleQuest={toggleQuestSelection}
                  onClearSelection={clearSelection}
                  onLaunchSession={handleLaunchFreeSession}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sélection de l'environnement */}
        <Card className="bg-slate-800 border-slate-700">
          <EnvironmentSelector
            environments={environments}
            selectedEnvironment={currentEnvironment}
            onSelectEnvironment={() => {}} // TODO: Implémenter la sélection d'environnement
            onLaunchDojo={handleLaunchImmersive}
            canLaunch={canLaunchDojo}
          />
        </Card>

        {/* Résumé de la sélection */}
        {canLaunchDojo && (
          <Card className="bg-green-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Prêt à lancer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentMode === "sessions" && selectedSession && (
                  <div>
                    <h3 className="text-white font-medium">Session: {selectedSession.linkedSkill.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedSession.quests.length} quêtes • {selectedSession.duration} minutes
                    </p>
                  </div>
                )}

                {currentMode === "free" && selectedQuests.length > 0 && (
                  <div>
                    <h3 className="text-white font-medium">Session Libre</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedQuests.length} quête{selectedQuests.length > 1 ? "s" : ""} sélectionnée
                      {selectedQuests.length > 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Environnement: {currentEnvironment.name}</span>
                  </div>
                </div>

                <Button
                  onClick={handleLaunchImmersive}
                  size="lg"
                  className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 w-full"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Lancer le Dojo Immersif
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
