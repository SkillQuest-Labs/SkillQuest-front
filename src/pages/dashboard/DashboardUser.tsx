import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import type { UserData, UserRoleType } from "@/shared/types/user.type";
import ProfileHud from "@/component/ProfileHud";
import WorkSessionChart from "@/modules/stats/components/chart/work-session-chart/WorkSessionChart";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { WelcomeSection } from "@/component/dashboard/WelcomeSection";
import { AccueilStatCard } from "@/modules/stats/components/AccueilStatsCard";
import { StreakComponent } from "@/component/dashboard/StreakComponent";
import { RecentSkillsComponent } from "@/component/dashboard/RecentSkillsComponent";
import { BarChart3, Target, TrendingUp } from "lucide-react";
import { computeUserProgress } from "@/shared/utils/compute-user-progress";

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

  const { totalXp, totalQuestCompleted, totalSkillCompleted, userCurrentLevel, xpMaxForLevel } =
    computeUserProgress(skills);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-8xl mx-auto px-3 sm:px-5 lg:px-7 py-6">
        <div className="space-y-8">
          {/* Section de bienvenue - Hero Section */}
          <div className="space-y-6">
            <WelcomeSection userName={fallbackUsername} streak={7} />

            {/* Cartes statistiques - Section de métriques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
              <AccueilStatCard title="XP Total" value={totalXp} icon={TrendingUp} />
              <AccueilStatCard title="Quêtes terminées" value={totalQuestCompleted} icon={BarChart3} />
              <AccueilStatCard title="Compétences validées" value={totalSkillCompleted} icon={Target} />
            </div>
          </div>

          {/* Zone principale de contenu */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Composant principal - WorkSessionChart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Composant de streak */}
              <StreakComponent currentStreak={7} maxStreak={7} />

              <WorkSessionChart />
            </div>

            {/* Sidebar pour composants futurs */}
            <div className="space-y-4">
              {/* Composant des dernières compétences */}
              <RecentSkillsComponent skills={skills} />

              <div className="h-64 bg-slate-800/30 rounded-xl border border-slate-600/30 p-6 flex items-center justify-center">
                <p className="text-slate-400 text-sm">Composant 2 - À implémenter</p>
              </div>

              {/* ProfileHud aligné sous le composant 2 */}
              <ProfileHud
                userName={user?.username || user?.firstName || "Aventurier"}
                title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
                level={userCurrentLevel}
                xp={totalXp}
                xpToNext={xpMaxForLevel}
                isCollapsible={true}
                defaultExpanded={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
