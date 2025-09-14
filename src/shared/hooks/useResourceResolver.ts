import {
  resolveMultipleResources,
  resolveResource as resolveResourceIntention,
} from "@/shared/services/resource-resolver/resource-resolver";
import type { ResolvedResource, ResourceIntention } from "@/shared/types/ai/ai.type";
import { useCallback, useState } from "react";
import { debugLogger } from "@/shared/utils/debug-logger";

export const useResourceResolver = () => {
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedResources, setResolvedResources] = useState<ResolvedResource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resolveResources = useCallback(async (intentions: ResourceIntention[]) => {
    debugLogger.info(`🔍 Début de résolution de ${intentions.length} ressources`, { intentions });
    setIsResolving(true);
    setError(null);

    try {
      const resolved = await resolveMultipleResources(intentions);
      setResolvedResources(resolved);
      return resolved;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      debugLogger.error("❌ Erreur lors de la résolution des ressources", {
        error: errorMessage,
        intentions,
      });
      setError(errorMessage);
      return [];
    } finally {
      setIsResolving(false);
    }
  }, []);

  const resolveResource = useCallback(async (intention: ResourceIntention) => {
    debugLogger.info("🔍 Tentative de résolution d'une ressource", {
      intention,
      type: intention.type,
    });
    setIsResolving(true);
    setError(null);

    try {
      const resource = await resolveResourceIntention(intention);
      if (resource) {
        debugLogger.info("✅ Ressource résolue avec succès", {
          intention,
          resource,
        });
        setResolvedResources((prev) => [...prev, resource]);
        return resource;
      } else {
        debugLogger.warn("⚠️ Aucune ressource trouvée", { intention });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      debugLogger.error("❌ Erreur lors de la résolution de la ressource", {
        error: errorMessage,
        intention,
      });
      setError(errorMessage);
      return null;
    } finally {
      setIsResolving(false);
    }
  }, []);

  const clearResources = useCallback(() => {
    setResolvedResources([]);
    setError(null);
  }, []);

  return {
    resolveResources,
    resolveResource,
    clearResources,
    isResolving,
    resolvedResources,
    error,
  };
};
