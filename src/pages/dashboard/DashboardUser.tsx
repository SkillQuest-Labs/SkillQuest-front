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
      <div className="max-w-8xl mx-auto px-3 sm:px-5 lg:px-7 py-4 h-full">
        <div className="h-full flex flex-col space-y-4">
          {/* Section de bienvenue - Hero Section compacte */}
          <div className="flex-shrink-0">
            <WelcomeSection userName={fallbackUsername} streak={7} />
          </div>

          {/* Zone principale de contenu - utilise l'espace restant */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Colonne principale - WorkSessionChart */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              {/* Section streak et statistiques - sur la même ligne */}
              <div className="h-20 sm:h-16 flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full overflow-hidden">
                {/* StreakComponent */}
                <StreakComponent currentStreak={7} maxStreak={7} className="h-16 flex-shrink-0" />
                {/* Cartes de statistiques */}
                <div className="flex gap-1 sm:gap-2 flex-1 justify-start sm:justify-end w-full sm:w-auto min-w-0">
                  <AccueilStatCard
                    title="XP Total"
                    value={totalXp}
                    icon={TrendingUp}
                    className="flex-1 min-w-0 sm:flex-none sm:w-36 lg:w-40 xl:w-44"
                  />
                  <AccueilStatCard
                    title="Skills"
                    value={totalSkillCompleted}
                    icon={Target}
                    className="flex-1 min-w-0 sm:flex-none sm:w-36 lg:w-40 xl:w-44"
                  />
                  <AccueilStatCard
                    title="Quêtes"
                    value={totalQuestCompleted}
                    icon={Award}
                    className="flex-1 min-w-0 sm:flex-none sm:w-36 lg:w-40 xl:w-44"
                  />
                </div>
              </div>

              {/* WorkSessionChart - utilise l'espace restant */}
              <div className="flex-1 min-h-0">
                <WorkSessionChart className="h-full" />
              </div>
            </div>

            {/* Sidebar droite - alignement vertical harmonieux */}
            <div className="flex flex-col space-y-3 relative">
              {/* RecentSkillsComponent - hauteur compacte */}
              <div className="h-32 flex-shrink-0">
                <RecentSkillsComponent skills={skills} className="h-full" />
              </div>

              {/* WeeklySessionsReminder - hauteur compacte */}
              <div className="h-32 flex-shrink-0">
                <WeeklySessionsReminder className="h-full" />
              </div>

              {/* ProfileHud - positionné en bas à droite */}
              <div className="absolute bottom-0 right-0 z-10">
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
        </div>
      </div>
    </div>
  );
};
