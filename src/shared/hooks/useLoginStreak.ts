import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";

interface LoginStreakData {
  currentStreak: number;
  lastLoginDate: string | null;
  loginHistory: string[];
}

const STREAK_STORAGE_KEY = "login-streak-data";

export const useLoginStreak = () => {
  const { user, isLoaded } = useUser();
  const [streakData, setStreakData] = useState<LoginStreakData>({
    currentStreak: 0,
    lastLoginDate: null,
    loginHistory: [],
  });

  // Charger les données de streak depuis localStorage
  const loadStreakData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STREAK_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setStreakData(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données de streak:", error);
    }
  }, []);

  // Sauvegarder les données de streak dans localStorage
  const saveStreakData = useCallback((data: LoginStreakData) => {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données de streak:", error);
    }
  }, []);

  // Calculer le streak basé sur l'historique des connexions
  const calculateStreak = useCallback((loginHistory: string[]): number => {
    if (loginHistory.length === 0) return 0;

    const today = new Date();
    let streak = 0;

    // Trier les dates par ordre décroissant
    const sortedDates = loginHistory.map((date) => new Date(date)).sort((a, b) => b.getTime() - a.getTime());

    // Vérifier les 7 derniers jours
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);

      // Normaliser les dates (ignorer l'heure)
      const checkDateStr = checkDate.toDateString();

      // Vérifier si l'utilisateur s'est connecté ce jour
      // Pour le premier jour (i === 0), vérifier aussi si la dernière connexion était aujourd'hui
      const hasLoginOnDate =
        sortedDates.some((loginDate) => loginDate.toDateString() === checkDateStr) ||
        (i === 0 && sortedDates[0]?.toDateString() === today.toDateString());

      if (hasLoginOnDate) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  // Mettre à jour le streak quand l'utilisateur se connecte
  const updateLoginStreak = useCallback(() => {
    if (!user || !isLoaded) return;

    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD

    setStreakData((prevData) => {
      // Vérifier si l'utilisateur s'est déjà connecté aujourd'hui
      if (prevData.lastLoginDate === today) {
        return prevData; // Pas de mise à jour nécessaire
      }

      // Ajouter la connexion d'aujourd'hui à l'historique
      const newLoginHistory = [...prevData.loginHistory];
      if (!newLoginHistory.includes(today)) {
        newLoginHistory.push(today);
      }

      // Garder seulement les 30 derniers jours pour éviter un localStorage trop lourd
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const filteredHistory = newLoginHistory.filter((date) => new Date(date) >= thirtyDaysAgo);

      // Calculer le nouveau streak
      const newStreak = calculateStreak(filteredHistory);

      const newData = {
        currentStreak: newStreak,
        lastLoginDate: today,
        loginHistory: filteredHistory,
      };

      // Sauvegarder les nouvelles données
      saveStreakData(newData);

      return newData;
    });
  }, [user, isLoaded, calculateStreak, saveStreakData]);

  // Effet pour mettre à jour le streak au chargement
  useEffect(() => {
    loadStreakData();
  }, [loadStreakData]);

  // Effet pour mettre à jour le streak quand l'utilisateur se connecte
  useEffect(() => {
    if (isLoaded && user) {
      updateLoginStreak();
    }
  }, [isLoaded, user, updateLoginStreak]);

  // Fonction pour réinitialiser le streak (utile pour les tests)
  const resetStreak = useCallback(() => {
    const emptyData = {
      currentStreak: 0,
      lastLoginDate: null,
      loginHistory: [],
    };
    setStreakData(emptyData);
    saveStreakData(emptyData);
  }, [saveStreakData]);

  return {
    currentStreak: streakData.currentStreak,
    lastLoginDate: streakData.lastLoginDate,
    loginHistory: streakData.loginHistory,
    resetStreak,
    isLoading: !isLoaded,
  };
};
