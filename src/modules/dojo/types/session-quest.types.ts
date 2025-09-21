import type { QuestStatus } from "@/shared/types/quest.type";

/**
 * Interface pour les quêtes dans une session
 * Représente la structure des données de quête dans une session
 */
export interface SessionQuest {
  id: string;
  questId: string;
  title: string;
  workSessionId: string;
  quest?: {
    title: string;
    status: QuestStatus;
    description?: string;
  };
  description?: string;
}

/**
 * Interface pour les quêtes étendues avec des propriétés optionnelles
 * Utilisée pour la compatibilité avec différents formats de données
 */
export interface ExtendedSessionQuest extends SessionQuest {
  quest?: {
    title: string;
    status: QuestStatus;
    description?: string;
  };
  description?: string;
}

/**
 * Type guard pour vérifier si un objet a une propriété description
 */
export function hasDescription(obj: any): obj is { description: string } {
  return obj && typeof obj === "object" && typeof obj.description === "string";
}

/**
 * Type guard pour vérifier si un objet est une SessionQuest valide
 */
export function isSessionQuest(obj: any): obj is SessionQuest {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.questId === "string" &&
    typeof obj.title === "string"
  );
}
