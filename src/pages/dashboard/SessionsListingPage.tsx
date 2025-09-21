import { SessionsListing } from "@/modules/sessions/SessionsListing";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { useUser } from "@clerk/clerk-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { useGetUserStats } from "@/shared/services/user/api-user";
import { useComputeUserProgress } from "@/modules/stats/hooks/use-compute-user-progress";
import XpGainHud from "@/component/XpGainHud";
import XpCelebrationOverlay from "@/component/XpCelebrationOverlay";
import { useState, useEffect, useMemo } from "react";
import { audioService } from "@/shared/services/audio.service";

export const SessionsListingPage = () => {
  const { isCollapsed } = useSidebarStore();
  const { user } = useUser();

  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";
  const role = (user?.unsafeMetadata?.role as string) ?? "apprenti";

  const { skills } = useGetSkills(user?.id || "");
  const { userStats } = useGetUserStats(user?.id || "");

  const { userCurrentLevel, xpThreshold, xpToNextLevel } = useComputeUserProgress({
    skills,
    userStats,
  });

  const currentXp = useMemo(() => xpThreshold - xpToNextLevel, [xpThreshold, xpToNextLevel]);
  // État pour contrôler l'affichage du HUD
  const [showHud, setShowHud] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [xpGain, setXpGain] = useState(0);
  const [previousXp, setPreviousXp] = useState(currentXp);
  const [awaitingCelebration, setAwaitingCelebration] = useState(false);

  // Écouter l'événement de validation de session
  useEffect(() => {
    const handleSessionValidated = async () => {
      setPreviousXp(currentXp);
      setShowHud(true);
      setShowOverlay(true);
      setXpGain(0);
      setAwaitingCelebration(true);

      // Jouer le son de coffre Zelda
      try {
        await audioService.playChestSound();
      } catch (error) {
        console.warn("Impossible de jouer le son:", error);
      }
    };

    window.addEventListener("sessionValidated", handleSessionValidated as EventListener);

    return () => {
      window.removeEventListener("sessionValidated", handleSessionValidated as EventListener);
    };
  }, [currentXp]);

  useEffect(() => {
    if (!awaitingCelebration) {
      return;
    }

    const gain = currentXp - previousXp;
    if (gain > 0) {
      setXpGain(gain);
      setAwaitingCelebration(false);

      // Jouer le son de gain XP
      audioService.playXpGainSound().catch((error) => console.warn("Impossible de jouer le son XP:", error));

      const syncTimeout = setTimeout(() => setPreviousXp(currentXp), 1200);
      return () => clearTimeout(syncTimeout);
    }

    const fallbackTimeout = setTimeout(() => setAwaitingCelebration(false), 5000);
    return () => clearTimeout(fallbackTimeout);
  }, [awaitingCelebration, currentXp, previousXp]);

  useEffect(() => {
    if (!showHud) {
      return;
    }
    const hudTimeout = setTimeout(() => setShowHud(false), 5000);
    return () => clearTimeout(hudTimeout);
  }, [showHud]);

  useEffect(() => {
    if (!showOverlay) {
      return;
    }
    const overlayTimeout = setTimeout(() => setShowOverlay(false), 2000);
    return () => clearTimeout(overlayTimeout);
  }, [showOverlay]);

  useEffect(() => {
    if (awaitingCelebration || showHud || showOverlay) {
      return;
    }
    setPreviousXp(currentXp);
  }, [currentXp, awaitingCelebration, showHud, showOverlay]);

  return (
    <div
      data-sidebar={isCollapsed ? "collapsed" : "expanded"}
      className={`p-4 md:p-8 min-h-screen ${
        isCollapsed ? "pl-20" : "pl-64"
      } bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300`}
    >
      <SessionsListing />

      {/* XpGainHud en bas à droite - affiché uniquement lors de la validation */}
      <div className="fixed bottom-4 right-4 z-50">
        <XpGainHud
          userName={fallbackUsername}
          title={role}
          level={userCurrentLevel}
          xp={currentXp}
          xpToNext={xpThreshold}
          avatarUrl={user?.imageUrl || "/profile.jpg"}
          previousXp={previousXp}
          isVisible={showHud}
        />
      </div>

      <XpCelebrationOverlay
        visible={showOverlay}
        xpGain={xpGain}
        level={userCurrentLevel}
        onComplete={() => setShowOverlay(false)}
      />
    </div>
  );
};
