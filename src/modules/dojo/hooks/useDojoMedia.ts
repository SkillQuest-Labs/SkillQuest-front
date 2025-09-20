import { useState, useEffect, useCallback } from "react";
import type { DojoEnvironment } from "../types/dojo.types";
import { DOJO_ENVIRONMENTS } from "../constants/dojo-environments";

export const useDojoMedia = () => {
  const [currentEnvironment, setCurrentEnvironment] = useState<DojoEnvironment>(
    DOJO_ENVIRONMENTS.find((env) => env.isActive) || DOJO_ENVIRONMENTS[0],
  );
  const [isImmersive, setIsImmersive] = useState(false);
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(true);
  const [collapsedCards, setCollapsedCards] = useState<string[]>([]);

  const toggleImmersive = useCallback(() => {
    setIsImmersive((prev) => !prev);
  }, []);

  const toggleBackground = useCallback(() => {
    setIsBackgroundVisible((prev) => !prev);
  }, []);

  const toggleCardCollapse = useCallback((cardId: string) => {
    setCollapsedCards((prev) => (prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]));
  }, []);

  const changeEnvironment = useCallback((environmentId: string) => {
    const environment = DOJO_ENVIRONMENTS.find((env) => env.id === environmentId);
    if (environment) {
      setCurrentEnvironment(environment);
    }
  }, []);

  const isCardCollapsed = useCallback(
    (cardId: string) => {
      return collapsedCards.includes(cardId);
    },
    [collapsedCards],
  );

  // Preload video when environment changes
  useEffect(() => {
    if (currentEnvironment.videoUrl.endsWith(".mp4")) {
      const video = document.createElement("video");
      video.preload = "auto";
      video.src = currentEnvironment.videoUrl;
    }
  }, [currentEnvironment]);

  return {
    currentEnvironment,
    environments: DOJO_ENVIRONMENTS,
    isImmersive,
    isBackgroundVisible,
    collapsedCards,
    toggleImmersive,
    toggleBackground,
    toggleCardCollapse,
    changeEnvironment,
    isCardCollapsed,
  };
};
