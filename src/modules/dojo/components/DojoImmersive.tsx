import React, { useRef, useEffect, useState } from "react";
import type { DojoEnvironment } from "../types/dojo.types";
import { PomodoroTimer } from "./PomodoroTimer";
import { SessionQuestDisplay } from "./SessionQuestDisplay";
import { SessionInfo } from "./SessionInfo";
import { usePomodoro } from "../hooks/usePomodoro";
import { DOJO_ANIMATIONS } from "../constants/dojo-environments";
import { X, Eye, EyeOff } from "lucide-react";
import type { Session } from "@/shared/services/session/api-session.type";
import { hasDescription } from "../types/session-quest.types";

interface DojoImmersiveProps {
  environment: DojoEnvironment;
  isBackgroundVisible: boolean;
  onExit: () => void;
  selectedSession: Session;
}

export const DojoImmersive: React.FC<DojoImmersiveProps> = ({
  environment,
  isBackgroundVisible,
  onExit,
  selectedSession,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPomodoroCollapsed, setIsPomodoroCollapsed] = useState(true);
  const [isUIHidden, setIsUIHidden] = useState(false);

  const { pomodoro, startPomodoro, pausePomodoro, resetPomodoro, updateDurations, formatTime, getPhaseLabel } =
    usePomodoro();

  useEffect(() => {
    const video = videoRef.current;
    if (video && environment.videoUrl.endsWith(".mp4")) {
      video.play().catch(console.error);
    }
  }, [environment.videoUrl]);

  // Empêcher le scroll du body quand le DojoImmersive est actif
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const isVideo = environment.videoUrl.endsWith(".mp4");

  const questsToDisplay = selectedSession.quests.map((sessionQuest, index) => {
    // Utilisation de type guards pour un accès sécurisé aux propriétés
    const getDescription = (): string => {
      if (hasDescription(sessionQuest.quest)) {
        return sessionQuest.quest.description;
      }
      if (hasDescription(sessionQuest)) {
        return sessionQuest.description;
      }
      return `Description de la quête ${index + 1}`;
    };

    return {
      id: sessionQuest.questId || sessionQuest.id || `quest-${index}`,
      title: sessionQuest.quest?.title || sessionQuest.title || `Quête ${index + 1}`,
      description: getDescription(),
      difficulty: "moyen" as const,
      estimatedTime: 30,
      xp: 50,
      skills: [selectedSession.linkedSkill.title],
      isCompleted: sessionQuest.quest?.status === "COMPLETED",
    };
  });

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden z-[9999] bg-black">
      {/* Background Video/Image */}
      <div
        className={`absolute inset-0 w-full h-full ${DOJO_ANIMATIONS.backgroundTransition} ${
          isBackgroundVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {isVideo ? (
          <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline autoPlay>
            <source src={environment.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={environment.videoUrl} alt={environment.name} className="w-full h-full object-cover" />
        )}

        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Session Info */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-in-out ${
          isUIHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <SessionInfo session={selectedSession} />
      </div>

      {/* Pomodoro Timer */}
      <div
        className={`absolute top-4 left-4 z-40 transition-all duration-500 ease-in-out ${
          isUIHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <PomodoroTimer
          pomodoro={pomodoro}
          isCollapsed={isPomodoroCollapsed}
          onToggleCollapse={() => setIsPomodoroCollapsed(!isPomodoroCollapsed)}
          onStart={startPomodoro}
          onPause={pausePomodoro}
          onReset={resetPomodoro}
          onUpdateDurations={updateDurations}
          formatTime={formatTime}
          getPhaseLabel={getPhaseLabel}
        />
      </div>

      {/* Quêtes Display */}
      <div
        className={`absolute bottom-4 left-4 z-40 transition-all duration-500 ease-in-out ${
          isUIHidden ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <SessionQuestDisplay quests={questsToDisplay} />
      </div>

      {/* Contrôles en haut */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        {/* Bouton pour masquer/afficher l'UI */}
        <button
          onClick={() => setIsUIHidden(!isUIHidden)}
          className="bg-black/20 backdrop-blur-sm border border-white/30 text-white hover:bg-black/30 rounded-lg px-3 py-2 transition-colors"
          title={isUIHidden ? "Afficher l'interface" : "Masquer l'interface"}
        >
          {isUIHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          onClick={onExit}
          className="bg-black/20 backdrop-blur-sm border border-white/30 text-white hover:bg-black/30 rounded-lg px-3 py-2 transition-colors"
          title="Fermer le dojo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
