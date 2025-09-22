export interface SessionData {
  sessionId: string;
  duration: number; // Durée prévue en secondes
  timeElapsed: number; // Temps réellement écoulé en secondes
  timeLeft: number; // Temps restant en secondes
  completed: boolean; // Si la session a été complétée
  environment: string; // ID de l'environnement
  completedAt: string; // Date de fin au format ISO
  pausedCount?: number; // Nombre de pauses
  pauseDuration?: number; // Durée totale des pauses en secondes
}

export interface SessionStats {
  totalTime: number;
  effectiveTime: number; // Temps sans les pauses
  efficiency: number; // Pourcentage d'efficacité
  environment: string;
  completed: boolean;
}
