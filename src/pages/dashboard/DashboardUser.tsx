import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";
import type { UserData, UserRoleType } from "@/shared/types/user.type";
import ProfileHud from "@/component/ProfileHud";
import WorkSessionChart from "@/modules/stats/components/chart/work-session-chart/WorkSessionChart";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { WelcomeSection } from "@/component/dashboard/WelcomeSection";
import { AccueilStatCard } from "@/modules/stats/components/AccueilStatsCard";
import { StreakComponent } from "@/component/dashboard/StreakComponent";
import { RecentSkillsComponent } from "@/component/dashboard/RecentSkillsComponent";
import { WeeklySessionsReminder } from "@/component/dashboard/WeeklySessionsReminder";
import { Award, Target, TrendingUp } from "lucide-react";
import { useComputeUserProgress } from "@/modules/stats/hooks/use-compute-user-progress";
import { useGetUserStats } from "@/shared/services/user/api-user";

// 🔹 intro robot
import IntroRobotOverlay from "@/component/intro/IntroRobotOverlay";
import { ROBOT_INTRO_LINES } from "@/shared/constants/voiceLines";

export const DashboardUser = () => {
  const { user } = useUser();
  const [streak, setStreak] = useState(1);
  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";

  const [, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) return;

    const role = (user.unsafeMetadata?.role as UserRoleType) ?? "apprenti";
    setUserData({
      username: fallbackUsername,
      role,
    });

    // Gestion streak
    const lastLogin = user.lastSignInAt ? new Date(user.lastSignInAt) : null;
    const today = new Date();
    const todayKey = today.toDateString();
    const lastSeen = localStorage.getItem("lastSeenDate");

    if (!lastLogin) {
      setStreak(1);
      localStorage.setItem("lastSeenDate", todayKey);
      return;
    }

    if (lastSeen === todayKey) return; // déjà compté aujourd’hui

    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(1);
    }

    localStorage.setItem("lastSeenDate", todayKey);
  }, [user, fallbackUsername]);

  const { skills } = useGetSkills(user?.id || "");
  const { userStats } = useGetUserStats(user?.id || "");

  const { userCurrentLevel, xpThreshold, xpToNextLevel, totalXp, totalQuestCompleted, totalSkillCompleted } =
    useComputeUserProgress({ skills, userStats });

  // 🔹 gestion relecture intro
  const [introKey, setIntroKey] = useState("intro_robot_v1");
  const handleReplayIntro = useCallback(() => {
    localStorage.removeItem("intro_robot_v1");
    setIntroKey((k) => `${k}_replay`); // force un remount de l’overlay
  }, []);

  useEffect(() => {
    const handler = () => handleReplayIntro();
    document.addEventListener("skq:replay-intro", handler);
    return () => document.removeEventListener("skq:replay-intro", handler);
  }, [handleReplayIntro]);

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

      <div className="max-w-8xl mx-auto px-3 sm:px-5 lg:px-7 py-6">
        <div className="space-y-8">
          {/* Section de bienvenue */}
          <div className="space-y-6">
            <WelcomeSection userName={fallbackUsername} streak={streak} />

            {/* Cartes statistiques */}
          </div>

          {/* CONTENU PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-4 min-h-0">
            {/* Colonne principale */}
            <div className="grid grid-rows-[auto_1fr] gap-4 min-h-0">
              {/* Streak + Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-4 items-center w-full">
                <div className="flex justify-center lg:justify-start">
                  <StreakComponent currentStreak={streak} maxStreak={7} />
                </div>

                <div className="grid grid-cols-3 gap-2 w-full">
                  <AccueilStatCard title="XP Total" value={totalXp} icon={TrendingUp} className="w-full h-16" />
                  <AccueilStatCard title="Skills" value={totalSkillCompleted} icon={Target} className="w-full h-16" />
                  <AccueilStatCard title="Quêtes" value={totalQuestCompleted} icon={Award} className="w-full h-16" />
                </div>
              </div>

              {/* Graph sessions */}
              <div className="min-h-0">
                <WorkSessionChart className="h-full w-full" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="grid grid-rows-[1fr_1fr] gap-4 min-h-0" style={{ paddingBottom: "120px" }}>
              <div className="min-h-0">
                <RecentSkillsComponent skills={skills} className="h-full" />
              </div>
              <div className="min-h-0">
                <WeeklySessionsReminder className="h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER HUD */}
        <div
          className="fixed bottom-4 z-50"
          style={{
            right: "calc(1rem + 1rem)",
            marginBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <ProfileHud
            userName={user?.username || user?.firstName || "Aventurier"}
            title="Aventurier"
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
