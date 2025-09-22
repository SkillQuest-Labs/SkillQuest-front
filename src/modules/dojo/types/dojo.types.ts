export interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  difficulty: "facile" | "moyen" | "difficile";
  estimatedTime: number; // en minutes
  isCompleted: boolean;
  skills: string[];
}

export interface DojoSession {
  id: string;
  questId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // en minutes
  isActive: boolean;
}

export interface PomodoroState {
  isRunning: boolean;
  timeLeft: number; // en secondes
  currentPhase: "work" | "shortBreak" | "longBreak";
  workDuration: number; // en minutes
  shortBreakDuration: number; // en minutes
  longBreakDuration: number; // en minutes
  completedPomodoros: number;
}

export interface DojoEnvironment {
  id: string;
  name: string;
  videoUrl: string;
  description: string;
  isActive: boolean;
}

export interface DojoState {
  isImmersive: boolean;
  isBackgroundVisible: boolean;
  collapsedCards: string[];
  currentEnvironment: DojoEnvironment;
  availableQuests: Quest[];
  currentSession?: DojoSession;
  pomodoro: PomodoroState;
}

export interface DojoControls {
  toggleImmersive: () => void;
  toggleBackground: () => void;
  toggleCardCollapse: (cardId: string) => void;
  startSession: (questId: string) => void;
  endSession: () => void;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  changeEnvironment: (environmentId: string) => void;
}
