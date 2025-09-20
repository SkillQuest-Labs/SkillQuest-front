import { useState, useEffect, useCallback } from "react";
import type { PomodoroState } from "../types/dojo.types";
import { POMODORO_DEFAULTS } from "../constants/dojo-environments";

export const usePomodoro = () => {
  // Charger les paramètres sauvegardés ou utiliser les valeurs par défaut
  const loadSavedSettings = () => {
    try {
      const saved = localStorage.getItem("pomodoro-settings");
      if (saved) {
        const settings = JSON.parse(saved);
        return {
          workDuration: settings.workDuration || POMODORO_DEFAULTS.workDuration,
          shortBreakDuration: settings.shortBreakDuration || POMODORO_DEFAULTS.shortBreakDuration,
          longBreakDuration: settings.longBreakDuration || POMODORO_DEFAULTS.longBreakDuration,
        };
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    }
    return {
      workDuration: POMODORO_DEFAULTS.workDuration,
      shortBreakDuration: POMODORO_DEFAULTS.shortBreakDuration,
      longBreakDuration: POMODORO_DEFAULTS.longBreakDuration,
    };
  };

  const savedSettings = loadSavedSettings();

  const [pomodoro, setPomodoro] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: savedSettings.workDuration * 60,
    currentPhase: "work",
    workDuration: savedSettings.workDuration,
    shortBreakDuration: savedSettings.shortBreakDuration,
    longBreakDuration: savedSettings.longBreakDuration,
    completedPomodoros: 0,
  });

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startPomodoro = useCallback(() => {
    setPomodoro((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pausePomodoro = useCallback(() => {
    setPomodoro((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetPomodoro = useCallback(() => {
    setPomodoro((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft:
        prev.currentPhase === "work"
          ? prev.workDuration * 60
          : prev.currentPhase === "shortBreak"
            ? prev.shortBreakDuration * 60
            : prev.longBreakDuration * 60,
    }));
  }, []);

  const updateDurations = useCallback((workDuration: number, shortBreakDuration: number, longBreakDuration: number) => {
    // Sauvegarder les paramètres dans localStorage
    try {
      localStorage.setItem(
        "pomodoro-settings",
        JSON.stringify({
          workDuration,
          shortBreakDuration,
          longBreakDuration,
        }),
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des paramètres:", error);
    }

    setPomodoro((prev) => ({
      ...prev,
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      timeLeft:
        prev.currentPhase === "work"
          ? workDuration * 60
          : prev.currentPhase === "shortBreak"
            ? shortBreakDuration * 60
            : longBreakDuration * 60,
    }));
  }, []);

  const switchPhase = useCallback(() => {
    setPomodoro((prev) => {
      if (prev.currentPhase === "work") {
        const nextPhase =
          (prev.completedPomodoros + 1) % POMODORO_DEFAULTS.longBreakInterval === 0 ? "longBreak" : "shortBreak";

        return {
          ...prev,
          currentPhase: nextPhase,
          timeLeft: nextPhase === "longBreak" ? prev.longBreakDuration * 60 : prev.shortBreakDuration * 60,
          completedPomodoros: prev.completedPomodoros + 1,
          isRunning: false,
        };
      } else {
        return {
          ...prev,
          currentPhase: "work",
          timeLeft: prev.workDuration * 60,
          isRunning: false,
        };
      }
    });
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const getPhaseLabel = useCallback((phase: PomodoroState["currentPhase"]) => {
    switch (phase) {
      case "work":
        return "Travail";
      case "shortBreak":
        return "Pause courte";
      case "longBreak":
        return "Pause longue";
      default:
        return "Travail";
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (pomodoro.isRunning && pomodoro.timeLeft > 0) {
      const id = setInterval(() => {
        setPomodoro((prev) => {
          if (prev.timeLeft <= 1) {
            // Appeler switchPhase et retourner le nouvel état
            const newState = {
              ...prev,
              timeLeft: 0,
            };
            // La logique de switchPhase sera gérée dans un autre useEffect
            return newState;
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
      }, 1000);

      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pomodoro.isRunning, pomodoro.timeLeft, intervalId]);

  // Effect pour gérer le changement de phase quand le timer atteint 0
  useEffect(() => {
    if (pomodoro.timeLeft === 0 && pomodoro.isRunning) {
      switchPhase();
    }
  }, [pomodoro.timeLeft, pomodoro.isRunning, switchPhase]);

  return {
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    updateDurations,
    formatTime,
    getPhaseLabel,
  };
};
