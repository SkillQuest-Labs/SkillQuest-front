import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import type { UserData, UserRoleType } from "@/shared/types/user.type";
import ProfileHud from "@/component/ProfileHud";
import WorkSessionChart from "@/modules/stats/components/chart/work-session-chart/WorkSessionChart";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { WelcomeSection } from "@/component/dashboard/WelcomeSection";
import { AccueilStatCard } from "@/modules/stats/components/AccueilStatsCard";
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
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="w-[95%] mx-auto  py-4 h-full">
        <div className="flex gap-4 h-full">
          {/* Colonne principale */}
          <div className="w-[85%] lg:col-span-4 space-y-4 flex flex-col h-full">
            {/* Section de bienvenue */}
            <div className="flex-shrink-0">
              <WelcomeSection userName={fallbackUsername} userLevel={userCurrentLevel} streak={7} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-shrink-0">
              <AccueilStatCard title="XP Total" value={totalXp} icon={TrendingUp} gradient="indigo" />
              <AccueilStatCard title="Quêtes terminées" value={totalQuestCompleted} icon={BarChart3} gradient="indigo" />
              <AccueilStatCard title="Compétences validées" value={totalSkillCompleted} icon={Target} gradient="rose" />
            </div>

            <div className="flex-1 min-h-0">
              <WorkSessionChart />
            </div>
          </div>

          <div className="lg:col-span-1 w-[15%] h-full">
            <ProfileHud
              userName={user?.username || user?.firstName || "Aventurier"}
              title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
              level={userCurrentLevel}
              xp={totalXp}
              xpToNext={xpMaxForLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
