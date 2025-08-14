import {
  resolveMultipleResources,
  resolveResource as resolveResourceIntention,
} from "@/shared/services/resource-resolver/resource-resolver";
import type { ResolvedResource, ResourceIntention } from "@/shared/types/ai/ai.type";
import { useCallback, useState } from "react";

export const useResourceResolver = () => {
  const [isResolving, setIsResolving] = useState(false);
  const [resolvedResources, setResolvedResources] = useState<ResolvedResource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resolveResources = useCallback(async (intentions: ResourceIntention[]) => {
    setIsResolving(true);
    setError(null);

    try {
      const resolved = await resolveMultipleResources(intentions);
      setResolvedResources(resolved);
      return resolved;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la résolution des ressources";
      setError(errorMessage);
      return [];
    } finally {
      setIsResolving(false);
    }
  }, []);

  const resolveResource = useCallback(async (intention: ResourceIntention) => {
    setIsResolving(true);
    setError(null);

    try {
      const resolved = await resolveResourceIntention(intention);
      if (resolved) {
        setResolvedResources((prev) => [...prev, resolved]);
        return resolved;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la résolution de la ressource";
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
