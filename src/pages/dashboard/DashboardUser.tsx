import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import type { UserData, UserRoleType } from "@/shared/types/user.type";
import ProfileHud from "@/component/ProfileHud";
import WorkSessionChart from "@/modules/stats/components/chart/work-session-chart/WorkSessionChart";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { WelcomeSection } from "@/component/dashboard/WelcomeSection";
import { StreakComponent } from "@/component/dashboard/StreakComponent";
import { RecentSkillsComponent } from "@/component/dashboard/RecentSkillsComponent";
import { WeeklySessionsReminder } from "@/component/dashboard/WeeklySessionsReminder";
import { useComputeUserProgress } from "@/modules/stats/hooks/use-compute-user-progress";
import { useGetUserStats } from "@/shared/services/user/api-user";

// 🔹 intro robot
import IntroRobotOverlay from "@/component/intro/IntroRobotOverlay";
import { ROBOT_INTRO_LINES } from "@/shared/constants/voiceLines";
import { AccueilStatCard } from "@/modules/stats/components/AccueilStatsCard";
import { Award, Target, TrendingUp } from "lucide-react";

export const DashboardUser = () => {
  const { user } = useUser();
  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";

  const [, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) return;
    const role = (user.unsafeMetadata?.role as UserRoleType) ?? "apprenti";
    setUserData({
      username: fallbackUsername,
      role,
    });
  }, [user, fallbackUsername]);

  const { skills } = useGetSkills(user?.id || "");
  const { userStats } = useGetUserStats(user?.id || "");

  const { userCurrentLevel, xpThreshold, xpToNextLevel, totalXp, totalQuestCompleted, totalSkillCompleted } =
    useComputeUserProgress({ skills, userStats });

  // 🔹 gestion relecture intro
  const [introKey, setIntroKey] = useState("intro_robot_v1");
  const handleReplayIntro = () => {
    localStorage.removeItem("intro_robot_v1");
    setIntroKey(introKey + "_replay"); // force un remount
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      {/* Intro robot */}
      <IntroRobotOverlay
        key={introKey}
        splineUrl="https://prod.spline.design/91E4RJArwH81QjTV/scene.splinecode"
        lines={ROBOT_INTRO_LINES}
        storageKey="intro_robot_v1"
        height="40vh"
      />

      {/* Bouton pour rejouer l’intro */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleReplayIntro}
          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black shadow"
        >
          Revoir l’intro
        </button>
      </div>

      <div className="max-w-8xl mx-auto px-3 sm:px-5 lg:px-7 py-6">
        <div className="space-y-8">
          {/* Section de bienvenue */}
          <div className="space-y-6">
            <WelcomeSection userName={fallbackUsername} streak={7} />
          </div>

          {/* CONTENU PRINCIPAL - Stats + Sessions + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-4 min-h-0">
            {/* ZONE PRINCIPALE - Stats + Sessions */}
            <div className="grid grid-rows-[auto_1fr] gap-4 min-h-0">
              {/* Section des statistiques - Streak + Stats Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-4 items-center w-full">
                {/* Streak Component */}
                <div className="flex justify-center lg:justify-start">
                  <StreakComponent currentStreak={7} maxStreak={7} />
                </div>

                {/* Stats Cards - XP, Skills, Quêtes */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  <AccueilStatCard title="XP Total" value={totalXp} icon={TrendingUp} className="w-full h-16" />
                  <AccueilStatCard title="Skills" value={totalSkillCompleted} icon={Target} className="w-full h-16" />
                  <AccueilStatCard title="Quêtes" value={totalQuestCompleted} icon={Award} className="w-full h-16" />
                </div>
              </div>

              {/* ZONE PRINCIPALE - Sessions (pleine hauteur disponible) */}
              <div className="min-h-0">
                <WorkSessionChart className="h-full w-full" />
              </div>
            </div>

            {/* SIDEBAR - Derniers skills + Sessions de la semaine (alignée avec les cartes de stats) */}
            <div className="grid grid-rows-[1fr_1fr] gap-4 min-h-0" style={{ paddingBottom: "120px" }}>
              {/* RecentSkillsComponent - Taille égale */}
              <div className="min-h-0">
                <RecentSkillsComponent skills={skills} className="h-full" />
              </div>

              {/* WeeklySessionsReminder - Taille égale */}
              <div className="min-h-0">
                <WeeklySessionsReminder className="h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Avatar utilisateur (aligné avec la colonne de droite) */}
        <div
          className="fixed bottom-4 z-50"
          style={{
            right: "calc(1rem + 1rem)", // Aligné avec le padding de la sidebar
            marginBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <ProfileHud
            userName={user?.username || user?.firstName || "Aventurier"}
            title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
            level={userCurrentLevel}
            xp={xpThreshold - xpToNextLevel}
            xpToNext={xpThreshold}
            isCollapsible={true}
            defaultExpanded={false}
          />
        </div>
      </div>
    </div>
  );
};
