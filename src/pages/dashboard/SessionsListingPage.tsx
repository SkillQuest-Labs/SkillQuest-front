import { SessionsListing } from "@/modules/sessions/SessionsListing";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { useUser } from "@clerk/clerk-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { useGetUserStats } from "@/shared/services/user/api-user";
import { useComputeUserProgress } from "@/modules/stats/hooks/use-compute-user-progress";
import XpGainHud from "@/component/XpGainHud";
import { useState, useEffect } from "react";

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

  // État pour contrôler l'affichage du HUD
  const [showHud, setShowHud] = useState(false);
  const [previousXp, setPreviousXp] = useState(xpThreshold - xpToNextLevel);

  // Écouter l'événement de validation de session
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleSessionValidated = () => {
      // Stocker l'XP actuel avant la mise à jour
      setPreviousXp(xpThreshold - xpToNextLevel);

      // Attendre un peu pour que les données se mettent à jour
      setTimeout(() => {
        // Une session a été validée, afficher le HUD
        setShowHud(true);

        // Annuler le timeout précédent s'il existe
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Masquer le HUD après 3 secondes (2s d'animation + 1s de délai)
        timeoutId = setTimeout(() => {
          setShowHud(false);
        }, 3000);
      }, 100); // Petit délai pour laisser le temps aux données de se mettre à jour
    };

    window.addEventListener("sessionValidated", handleSessionValidated as EventListener);

    return () => {
      window.removeEventListener("sessionValidated", handleSessionValidated as EventListener);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [xpThreshold, xpToNextLevel]);

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
          xp={xpThreshold - xpToNextLevel}
          xpToNext={xpThreshold}
          avatarUrl={user?.imageUrl || "/profile.jpg"}
          previousXp={previousXp}
          isVisible={showHud}
        />
      </div>
    </div>
  );
};
