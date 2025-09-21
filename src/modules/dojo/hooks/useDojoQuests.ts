import { useGetQuests } from "@/shared/services/quest/api-quest";
import { useMemo, useState } from "react";
import type { Quest } from "../types/dojo.types";

export const useDojoQuests = () => {
  const [selectedQuests, setSelectedQuests] = useState<Quest[]>([]);

  // Récupérer toutes les quêtes (on peut passer une chaîne vide pour récupérer toutes les quêtes)
  const { quests, loading } = useGetQuests("");

  // Convertir les quêtes au format Quest du Dojo
  const availableQuests = useMemo(() => {
    if (!quests) return [];

    return quests.map(
      (quest): Quest => ({
        id: quest.questId,
        title: quest.title,
        description: quest.description || `Description de la quête ${quest.title}`,
        difficulty: (quest.difficulty?.toLowerCase() as "facile" | "moyen" | "difficile") || "moyen",
        estimatedTime: 30, // Valeur par défaut car l'API ne fournit pas cette info
        xp: quest.xp || 50,
        skills: [], // L'API ne fournit pas cette info pour l'instant
        isCompleted: quest.status === "COMPLETED",
      }),
    );
  }, [quests]);

  const toggleQuestSelection = (quest: Quest) => {
    setSelectedQuests((prev) => {
      const isSelected = prev.some((q) => q.id === quest.id);
      if (isSelected) {
        return prev.filter((q) => q.id !== quest.id);
      } else {
        return [...prev, quest];
      }
    });
  };

  const clearSelection = () => {
    setSelectedQuests([]);
  };

  return {
    quests: availableQuests,
    selectedQuests,
    loading,
    hasQuests: availableQuests.length > 0,
    toggleQuestSelection,
    clearSelection,
  };
};
