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

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="h-full w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Layout principal en CSS Grid - Structure responsive selon spécifications */}
        {/* 
          Breakpoints:
          - Mobile (<768px): pile verticale (header → contenu → sidebar → avatar)
          - Écran moyen (≥768px et <1280px): sidebar passe sous la zone principale
          - Écran large (≥1280px): affichage en 3 colonnes (header en haut, contenu gauche, sidebar droite)
        */}
        <div className="h-full grid grid-rows-[auto_1fr] grid-cols-1 md:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4">
          {/* HEADER - Message de bienvenue, streak, stats, citation */}
          <div className="col-span-1 md:col-span-2 xl:col-span-2">
            <div className="grid grid-rows-[auto_auto] gap-4">
              {/* WelcomeSection avec citation */}
              <div>
                <WelcomeSection userName={fallbackUsername} streak={7} />
              </div>

              {/* Section des statistiques - Streak + Stats Cards (plus compactes) */}
              <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 items-center">
                {/* Streak Component */}
                <div className="flex justify-center lg:justify-start">
                  <StreakComponent currentStreak={7} maxStreak={7} className="h-16" />
                </div>

                {/* Stats Cards - XP, Skills, Quêtes (plus petites et poussées à gauche) */}
                <div className="grid grid-cols-3 gap-3 max-w-2xl">
                  <AccueilStatCard title="XP Total" value={totalXp} icon={TrendingUp} className="w-full h-16" />
                  <AccueilStatCard title="Skills" value={totalSkillCompleted} icon={Target} className="w-full h-16" />
                  <AccueilStatCard title="Quêtes" value={totalQuestCompleted} icon={Award} className="w-full h-16" />
                </div>
              </div>
            </div>
          </div>

          {/* ZONE PRINCIPALE - Sessions (pleine hauteur disponible) */}
          <div className="min-h-0">
            <WorkSessionChart className="h-full w-full" />
          </div>

          {/* SIDEBAR - Derniers skills + Sessions de la semaine (équilibrés) */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* RecentSkillsComponent - Commence au niveau des stats */}
            <div className="flex-1 min-h-0">
              <RecentSkillsComponent skills={skills} className="h-full" />
            </div>

            {/* WeeklySessionsReminder - Équilibré avec les derniers skills */}
            <div className="flex-1 min-h-0">
              <WeeklySessionsReminder className="h-full" />
            </div>
          </div>
        </div>

        {/* FOOTER - Avatar utilisateur (position fixe en bas à droite) */}
        <div className="fixed bottom-4 right-4 z-50">
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
