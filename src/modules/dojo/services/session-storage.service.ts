import type { SessionData, SessionStats } from "../types/session-data.type";

class SessionStorageService {
  private static instance: SessionStorageService;
  private sessionData: SessionData | null = null;

  static getInstance(): SessionStorageService {
    if (!SessionStorageService.instance) {
      SessionStorageService.instance = new SessionStorageService();
    }
    return SessionStorageService.instance;
  }

  // Sauvegarder les données de session
  saveSessionData(data: SessionData): void {
    this.sessionData = data;

    // Sauvegarder dans le localStorage pour la persistance
    localStorage.setItem("currentSessionData", JSON.stringify(data));

    console.log("Session data saved:", data);
  }

  // Récupérer les données de session
  getSessionData(): SessionData | null {
    if (this.sessionData) {
      return this.sessionData;
    }

    // Essayer de récupérer depuis le localStorage
    const stored = localStorage.getItem("currentSessionData");
    if (stored) {
      try {
        this.sessionData = JSON.parse(stored);
        return this.sessionData;
      } catch (error) {
        console.error("Error parsing stored session data:", error);
        localStorage.removeItem("currentSessionData");
      }
    }

    return null;
  }

  // Calculer les statistiques de session
  calculateSessionStats(data: SessionData): SessionStats {
    const efficiency = data.duration > 0 ? (data.timeElapsed / data.duration) * 100 : 0;

    return {
      totalTime: data.duration,
      effectiveTime: data.timeElapsed,
      efficiency: Math.min(efficiency, 100),
      environment: data.environment,
      completed: data.completed,
    };
  }

  // Envoyer les données au backend
  async sendToBackend(data: SessionData): Promise<boolean> {
    try {
      // TODO: Remplacer par l'URL de votre API
      const response = await fetch("/api/sessions/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Session data sent to backend successfully");
        this.clearSessionData();
        return true;
      } else {
        console.error("Failed to send session data to backend:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Error sending session data to backend:", error);
      return false;
    }
  }

  // Nettoyer les données de session
  clearSessionData(): void {
    this.sessionData = null;
    localStorage.removeItem("currentSessionData");
  }

  // Vérifier si une session est en cours
  hasActiveSession(): boolean {
    return this.getSessionData() !== null;
  }
}

export const sessionStorageService = SessionStorageService.getInstance();
