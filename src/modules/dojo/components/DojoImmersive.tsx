import React, { useRef, useEffect, useState } from "react";
import type { DojoEnvironment } from "../types/dojo.types";
import { PomodoroTimer } from "./PomodoroTimer";
import { SessionQuestDisplay } from "./SessionQuestDisplay";
import { SessionInfo } from "./SessionInfo";
import { usePomodoro } from "../hooks/usePomodoro";
import { DOJO_ANIMATIONS } from "../constants/dojo-environments";
import { X, Eye, EyeOff, Play, Pause, CheckCircle, Square } from "lucide-react";
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
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);
  const [sessionTimeElapsed, setSessionTimeElapsed] = useState(0);
  const [showSessionCompleteModal, setShowSessionCompleteModal] = useState(false);

  const { pomodoro, startPomodoro, pausePomodoro, resetPomodoro, updateDurations, formatTime, getPhaseLabel } =
    usePomodoro();

  // Initialiser le temps de session
  useEffect(() => {
    setSessionTimeLeft(selectedSession.duration * 60); // Convertir en secondes
  }, [selectedSession.duration]);

  // Décompte de la session
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSessionStarted && !isSessionPaused && sessionTimeLeft > 0 && !isSessionCompleted) {
      interval = setInterval(() => {
        setSessionTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSessionStarted(false);
            setIsSessionPaused(false);
            setIsSessionCompleted(true);
            setShowSessionCompleteModal(true);
            return 0;
          }
          return prev - 1;
        });
        setSessionTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionStarted, isSessionPaused, sessionTimeLeft, isSessionCompleted]);

  // Fonctions de gestion de session
  const toggleSession = () => {
    if (!isSessionStarted) {
      // État Play : Lancer la session
      setIsSessionStarted(true);
      setIsSessionPaused(false);
      setIsSessionCompleted(false);
    } else if (isSessionPaused) {
      // État Pause : Reprendre la session
      setIsSessionPaused(false);
    } else if (isSessionCompleted) {
      // État Terminé : Ne rien faire (bouton désactivé)
      return;
    } else {
      // État en cours : Mettre en pause
      setIsSessionPaused(true);
    }
  };

  const extendSession = () => {
    setSessionTimeLeft((prev) => prev + 15 * 60); // Ajouter 15 minutes
    setShowSessionCompleteModal(false);
    setIsSessionStarted(true);
    setIsSessionPaused(false);
    setIsSessionCompleted(false);
  };

  const endSession = async () => {
    // Marquer la session comme terminée
    setIsSessionCompleted(true);

    // Réinitialiser tous les états
    setIsSessionStarted(false);
    setIsSessionPaused(false);
    setSessionTimeElapsed(0);
    setShowSessionCompleteModal(false);
    onExit();
  };

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
        <SessionInfo
          session={selectedSession}
          sessionTimeLeft={sessionTimeLeft}
          isSessionActive={isSessionStarted && !isSessionPaused}
          isSessionPaused={isSessionPaused}
        />
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

      {/* Boutons de session en bas à droite */}
      <div
        className={`absolute bottom-4 right-4 z-50 flex space-x-2 transition-all duration-500 ease-in-out ${
          isUIHidden ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        {/* Bouton play/pause */}
        <button
          onClick={toggleSession}
          disabled={isSessionCompleted}
          className={`backdrop-blur-sm border rounded-lg transition-all duration-200 group ${
            isSessionCompleted
              ? "bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed px-3 py-2"
              : isSessionStarted
                ? "bg-black/20 border-white/30 text-white hover:bg-black/30 hover:scale-105 px-3 py-2 hover:px-4 hover:py-2"
                : "bg-black/20 border-white/30 text-white hover:bg-black/30 hover:scale-105 px-4 py-2 text-sm font-medium"
          }`}
          title={
            isSessionCompleted
              ? "Session terminée"
              : !isSessionStarted
                ? "Lancer la session"
                : isSessionPaused
                  ? "Reprendre la session"
                  : "Mettre en pause"
          }
        >
          {isSessionCompleted ? (
            <Square className="w-4 h-4" />
          ) : !isSessionStarted ? (
            "Lancer la session"
          ) : isSessionPaused ? (
            <div className="flex items-center justify-center">
              <Play className="w-4 h-4" />
              <span className="group-hover:inline hidden ml-2">Reprendre</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Pause className="w-4 h-4" />
              <span className="group-hover:inline hidden ml-2">Pause</span>
            </div>
          )}
        </button>

        {/* Bouton terminer la session */}
        {isSessionStarted && !isSessionCompleted && (
          <button
            onClick={() => {
              setShowSessionCompleteModal(true);
            }}
            className="bg-black/20 backdrop-blur-sm border border-white/30 text-white hover:bg-blue-500/30 hover:border-blue-500/30 hover:text-blue-400 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105 text-sm font-medium"
            title="Terminer la session maintenant"
          >
            Terminer la session
          </button>
        )}
      </div>

      {/* Modal de fin de session */}
      {showSessionCompleteModal && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 max-w-md w-full mx-4 text-center relative">
            {/* Bouton fermer */}
            <button
              onClick={() => {
                setShowSessionCompleteModal(false);
                // Si la session était terminée automatiquement, la remettre en état actif
                if (isSessionCompleted) {
                  setIsSessionCompleted(false);
                }
              }}
              className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm border border-white/30 text-white hover:bg-black/30 rounded-lg p-2 transition-colors"
              title="Fermer la modale"
            >
              <X className="w-4 h-4" />
            </button>

            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Session terminée !</h3>
            <div className="text-gray-400 mb-4 space-y-1">
              <p>Durée prévue : {selectedSession.duration} minutes</p>
              <p>
                Temps écoulé : {Math.floor(sessionTimeElapsed / 60)}:
                {(sessionTimeElapsed % 60).toString().padStart(2, "0")}
              </p>
              <p>Environnement : {environment.name}</p>
            </div>
            <p className="text-gray-300 mb-6">Que souhaitez-vous faire ?</p>

            <div className="flex space-x-3">
              <button
                onClick={extendSession}
                className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 rounded-lg px-4 py-2 transition-colors"
              >
                Prolonger (+15min)
              </button>
              <button
                onClick={endSession}
                className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 rounded-lg px-4 py-2 transition-colors"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
