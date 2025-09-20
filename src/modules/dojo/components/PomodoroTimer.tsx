import React from "react";
import { useState, useEffect } from "react";
import type { PomodoroState } from "../types/dojo.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface PomodoroTimerProps {
  pomodoro: PomodoroState;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onUpdateDurations: (work: number, shortBreak: number, longBreak: number) => void;
  formatTime: (seconds: number) => string;
  getPhaseLabel: (phase: PomodoroState["currentPhase"]) => string;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  pomodoro,
  isCollapsed,
  onToggleCollapse,
  onStart,
  onPause,
  onReset,
  onUpdateDurations,
  formatTime,
  getPhaseLabel,
}) => {
  const [activeTab, setActiveTab] = useState("timer");
  const [tempDurations, setTempDurations] = useState({
    work: pomodoro.workDuration,
    shortBreak: pomodoro.shortBreakDuration,
    longBreak: pomodoro.longBreakDuration,
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const getPhaseColor = (phase: PomodoroState["currentPhase"]) => {
    switch (phase) {
      case "work":
        return "text-yellow-400";
      case "shortBreak":
        return "text-yellow-300";
      case "longBreak":
        return "text-yellow-500";
      default:
        return "text-yellow-400";
    }
  };

  // Notifications visuelles
  useEffect(() => {
    if (pomodoro.timeLeft === 0 && !pomodoro.isRunning) {
      const message =
        pomodoro.currentPhase === "work"
          ? "Session de travail terminée ! 🎉"
          : pomodoro.currentPhase === "shortBreak"
            ? "Pause courte terminée ! ⏰"
            : "Pause longue terminée ! 🎯";

      setNotificationMessage(message);
      setShowNotification(true);

      // Masquer la notification après 3 secondes
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [pomodoro.timeLeft, pomodoro.isRunning, pomodoro.currentPhase]);

  const validateDuration = (type: keyof typeof tempDurations, value: string) => {
    const numValue = parseInt(value);
    const errors: { [key: string]: string } = {};

    if (isNaN(numValue) || numValue < 1) {
      errors[type] = "La durée doit être d'au moins 1 minute";
    } else if (numValue > 60) {
      errors[type] = "La durée ne peut pas dépasser 60 minutes";
    } else if (type === "shortBreak" && numValue > 30) {
      errors[type] = "La pause courte ne peut pas dépasser 30 minutes";
    }

    setErrors((prev) => ({ ...prev, [type]: errors[type] || "" }));
    return Object.keys(errors).length === 0;
  };

  const handleDurationChange = (type: keyof typeof tempDurations, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(1, Math.min(type === "shortBreak" ? 30 : 60, numValue));

    setTempDurations((prev) => ({ ...prev, [type]: clampedValue }));
    validateDuration(type, value);
  };

  const handleSaveSettings = () => {
    // Valider toutes les durées avant de sauvegarder
    const workValid = validateDuration("work", tempDurations.work.toString());
    const shortBreakValid = validateDuration("shortBreak", tempDurations.shortBreak.toString());
    const longBreakValid = validateDuration("longBreak", tempDurations.longBreak.toString());

    if (workValid && shortBreakValid && longBreakValid) {
      onUpdateDurations(tempDurations.work, tempDurations.shortBreak, tempDurations.longBreak);
      setActiveTab("timer");
      setErrors({});
    }
  };

  if (isCollapsed) {
    return (
      <div
        className="bg-black/20 backdrop-blur-sm border border-white/30 text-white rounded-lg px-4 py-2 cursor-pointer hover:bg-black/30 transition-colors"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Clock className="w-3 h-3 text-white/80" />
          <div className={`text-sm font-mono font-bold ${getPhaseColor(pomodoro.currentPhase)}`}>
            {formatTime(pomodoro.timeLeft)}
          </div>
          {pomodoro.completedPomodoros > 0 && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400">{pomodoro.completedPomodoros}</span>
            </div>
          )}
          <ChevronDown className="w-3 h-3 text-white/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/30 text-white rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="p-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-white/80" />
              <span className="text-xs font-medium text-white/80">Pomodoro</span>
            </div>
            <div className="flex items-center space-x-1 ml-3">
              <TabsList className="bg-black/20 border-white/30 h-5">
                <TabsTrigger value="timer" className="text-xs data-[state=active]:bg-white/20 px-1 py-0.5">
                  <Clock className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-white/20 px-1 py-0.5">
                  <Settings className="w-3 h-3" />
                </TabsTrigger>
              </TabsList>
              <button onClick={onToggleCollapse} className="p-1 hover:bg-white/10 rounded transition-colors">
                <ChevronUp className="w-3 h-3 text-white/60" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-3 pb-3">
          <TabsContent value="timer" className="space-y-3">
            {/* Temps - Centré et mis en valeur */}
            <div className="text-center py-2">
              <div className={`text-lg font-mono font-bold ${getPhaseColor(pomodoro.currentPhase)}`}>
                {formatTime(pomodoro.timeLeft)}
              </div>
              <div className="text-xs text-white/60 mt-1">{getPhaseLabel(pomodoro.currentPhase)}</div>

              {/* Compteur de pomodoros */}
              {pomodoro.completedPomodoros > 0 && (
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">
                    {pomodoro.completedPomodoros} pomodoro{pomodoro.completedPomodoros > 1 ? "s" : ""} complété
                    {pomodoro.completedPomodoros > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Contrôles - Centrés et espacés */}
            <div className="flex justify-center space-x-2">
              {pomodoro.isRunning ? (
                <button
                  onClick={onPause}
                  className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 rounded px-3 py-1.5 transition-colors"
                >
                  <Pause className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={onStart}
                  className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 rounded px-3 py-1.5 transition-colors"
                >
                  <Play className="w-3 h-3" />
                </button>
              )}

              <button
                onClick={onReset}
                className="bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 rounded px-3 py-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3">
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Travail (min)</Label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={tempDurations.work}
                  onChange={(e) => handleDurationChange("work", e.target.value)}
                  className={`bg-black/20 border-white/20 text-white text-xs h-6 w-full ${
                    errors.work ? "border-red-500" : ""
                  }`}
                />
                {errors.work && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">{errors.work}</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Pause courte (min)</Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={tempDurations.shortBreak}
                  onChange={(e) => handleDurationChange("shortBreak", e.target.value)}
                  className={`bg-black/20 border-white/20 text-white text-xs h-6 w-full ${
                    errors.shortBreak ? "border-red-500" : ""
                  }`}
                />
                {errors.shortBreak && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">{errors.shortBreak}</span>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1 block">Pause longue (min)</Label>
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={tempDurations.longBreak}
                  onChange={(e) => handleDurationChange("longBreak", e.target.value)}
                  className={`bg-black/20 border-white/20 text-white text-xs h-6 w-full ${
                    errors.longBreak ? "border-red-500" : ""
                  }`}
                />
                {errors.longBreak && (
                  <div className="flex items-center space-x-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-red-400">{errors.longBreak}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-1">
              <Button
                onClick={handleSaveSettings}
                size="sm"
                className="w-full bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 text-xs h-6"
              >
                Sauvegarder
              </Button>
            </div>
          </TabsContent>
        </div>

        {/* Notification visuelle */}
        {showNotification && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
              <div className="text-white text-sm font-medium">{notificationMessage}</div>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
};
