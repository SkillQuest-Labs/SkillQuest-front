import { useUser } from "@clerk/clerk-react";
import { useEffect, useMemo, useState } from "react";
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

// Helpers
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isYesterday = (today: Date, last: Date) => {
  const d = new Date(today);
  d.setDate(d.getDate() - 1);
  return sameDay(d, last);
};

export const DashboardUser = () => {
  const { user } = useUser();
  const [streak, setStreak] = useState<number>(0);

  // nom/role pour le hero
  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";
  const [, setUserData] = useState<UserData | null>(null);

  // Init userData
  useEffect(() => {
    if (!user) return;
    const role = (user.unsafeMetadata?.role as UserRoleType) ?? "apprenti";
    setUserData({ username: fallbackUsername, role });
  }, [user, fallbackUsername]);

  // ===== Streak auto basé sur la dernière connexion Clerk + memo localStorage =====
  useEffect(() => {
    if (!user) return;

    const key = `sq_streak_${user.id}`;
    const today = new Date();
    const lastSignInAt = user.lastSignInAt ? new Date(user.lastSignInAt) : null;

    // lecture éventuelle du cache local
    let cachedCount = 0;
    let cachedDate: Date | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as { lastISO: string; count: number };
        cachedCount = parsed.count ?? 0;
        cachedDate = parsed.lastISO ? new Date(parsed.lastISO) : null;
      }
    } catch {
      /* ignore */
    }

    // Priorité à la date Clerk si dispo, sinon fallback cache
    const reference = lastSignInAt ?? cachedDate ?? null;

    let next = 1; // premier jour par défaut
    if (reference) {
      if (sameDay(today, reference)) {
        next = Math.max(1, cachedCount); // déjà compté aujourd'hui
      } else if (isYesterday(today, reference)) {
        next = Math.max(1, cachedCount) + 1; // continuité
      } else {
        next = 1; // rupture
      }
    }

    setStreak(next);
    localStorage.setItem(key, JSON.stringify({ lastISO: today.toISOString(), count: next }));
  }, [user]);

  // ===== Données métiers =====
  const userId = user?.id || "";
  const { skills = [] } = useGetSkills(userId);
  const { userStats } = useGetUserStats(userId);

  const {
    totalXp,
    totalQuestCompleted,
    totalSkillCompleted,
    userCurrentLevel,
    xpThreshold,     // XP requis pour compléter le niveau courant
    xpToNextLevel,   // XP restant pour passer au niveau suivant
  } = useComputeUserProgress({ skills, userStats });

  // XP acquis dans le niveau courant
  const currentLevelXp = useMemo(() => {
    if (!xpThreshold || xpToNextLevel == null) return 0;
    return Math.max(0, xpThreshold - xpToNextLevel);
  }, [xpThreshold, xpToNextLevel]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="h-full w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-full grid grid-rows-[auto_1fr] gap-4">
          {/* HEADER */}
          <div>
            <WelcomeSection userName={fallbackUsername} streak={streak} />
          </div>

          {/* CONTENU PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-4 min-h-0">
            {/* ZONE PRINCIPALE */}
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

              {/* Sessions */}
              <div className="min-h-0">
                <WorkSessionChart className="h-full w-full" />
              </div>
            </div>

            {/* SIDEBAR */}
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

        {/* HUD flottant */}
        <div
          className="fixed bottom-4 z-50"
          style={{
            right: "calc(1rem + 1rem)",
            marginBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <ProfileHud
            userName={user?.username || user?.firstName || "Aventurier"}
            title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
            level={userCurrentLevel}
            xp={currentLevelXp}
            xpToNext={xpThreshold || 0}
            isCollapsible={true}
            defaultExpanded={false}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardUser;
