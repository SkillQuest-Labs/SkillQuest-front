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

  const { userCurrentLevel, xpThreshold, xpToNextLevel } = useComputeUserProgress({ skills, userStats });

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
              {/* Composant de streak - hauteur compacte */}
              <div className="h-16 flex-shrink-0">
                <StreakComponent currentStreak={7} maxStreak={7} className="h-full" />
              </div>

              {/* WorkSessionChart - utilise l'espace restant */}
              <div className="flex-1 min-h-0">
                <WorkSessionChart className="h-full" />
              </div>
            </div>

            {/* Sidebar droite - alignement vertical harmonieux */}
            <div className="flex flex-col space-y-4">
              {/* RecentSkillsComponent - hauteur compacte */}
              <div className="h-40 flex-shrink-0">
                <RecentSkillsComponent skills={skills} className="h-full" />
              </div>

              {/* WeeklySessionsReminder - hauteur compacte */}
              <div className="h-40 flex-shrink-0">
                <WeeklySessionsReminder className="h-full" />
              </div>

              {/* ProfileHud - utilise l'espace restant */}
              <div className="flex-1 min-h-0">
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
