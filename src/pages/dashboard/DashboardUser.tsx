import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import type { UserData, UserRoleType } from "@/shared/types/user.type";

import ProfileHud from "@/component/ProfileHud";
import WorkSessionChart from "@/modules/stats/components/chart/work-session-chart/WorkSessionChart";

import { useUserProgressFromQuests } from "@/shared/hooks/useUserProgressFromQuests";
import { useGetSkills } from "@/shared/services/skill/api-skill";

import { WelcomeSection } from "@/component/dashboard/WelcomeSection";
import { FortniteStatCard } from "@/modules/stats/components/FortniteStatCard";
import { BarChart3, Target, TrendingUp } from "lucide-react";
import IntroRobotOverlay from "@/component/intro/IntroRobotOverlay";
import { ROBOT_INTRO_LINES } from "@/shared/constants/voiceLines";

export const DashboardUser = () => {
  const { user, isLoaded } = useUser();

  const userId = user?.id ?? "";
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

  // 🔹 Récupérer les skills de l’utilisateur
  const { skills = [] } = useGetSkills(isLoaded ? userId : "");
  const firstSkillId = skills.length > 0 ? ((skills[0] as any).id ?? (skills[0] as any).skillId ?? "") : "";

  // 🔹 Progression basée sur les quêtes
  const { level, xpUser, xpMax } = useUserProgressFromQuests(firstSkillId);

  // 🔹 Petites stats simplifiées
  const totalXp = skills.reduce((acc, s: any) => acc + (s.totalXp || 0), 0);
  const questsCompleted = skills.reduce((acc, s: any) => acc + (s.completedQuests || 0), 0);
  const skillsCompleted = skills.filter((s: any) => s.status === "COMPLETED").length;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <IntroRobotOverlay
        splineUrl="https://prod.spline.design/91E4RJArwH81QjTV/scene.splinecode"
        lines={ROBOT_INTRO_LINES.map(line => line.src)}
        height="40vh"
        onFinish={() => { } } storageKey={""}      />
      <div className="w-[95%] mx-auto  py-4 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full items-start">
          {/* Colonne principale */}
          <div className="lg:col-span-4 space-y-4 flex flex-col h-full">
            {/* Section de bienvenue */}
            <div className="flex-shrink-0">
              <WelcomeSection
                userName={fallbackUsername}
                userLevel={level}
                streak={7} // Vous pouvez calculer cela basé sur vos données
              />
            </div>

            {/* Statistiques Fortnite */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-shrink-0">
              <FortniteStatCard title="XP Total" value={totalXp} icon={TrendingUp} gradient="indigo" />
              <FortniteStatCard title="Quêtes terminées" value={questsCompleted} icon={BarChart3} gradient="amber" />
              <FortniteStatCard title="Compétences validées" value={skillsCompleted} icon={Target} gradient="rose" />
            </div>

            {/* Graphique des sessions de travail */}
            <div className="flex-1 min-h-0">
              <WorkSessionChart />
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="lg:col-span-1 h-full">
            <ProfileHud
              userName={user?.username || user?.firstName || "Aventurier"}
              title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
              level={level}
              xp={xpUser}
              xpToNext={xpMax}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
