import { useUser } from "@clerk/clerk-react";
import { Target, Award, TrendingUp } from "lucide-react";
import ProfileHud from "@/component/ProfileHud";
import WorkSessionChart from "@/modules/stats/components/chart/work-session-chart/WorkSessionChart";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { WelcomeSection } from "@/component/dashboard/WelcomeSection";
import { RecentSkillsComponent } from "@/component/dashboard/RecentSkillsComponent";
import { WeeklySessionsReminder } from "@/component/dashboard/WeeklySessionsReminder";
import { StreakComponent } from "@/component/dashboard/StreakComponent";
import { useComputeUserProgress } from "@/modules/stats/hooks/use-compute-user-progress";
import { useGetUserStats } from "@/shared/services/user/api-user";

export const DashboardUser = () => {
  const { user } = useUser();

  const fallbackUsername = user?.username ?? user?.firstName ?? "Aventurier";

  const { skills } = useGetSkills(user?.id || "");

  const { userStats } = useGetUserStats(user?.id || "");

  const { userCurrentLevel, xpThreshold, xpToNextLevel, totalXp } = useComputeUserProgress({ skills, userStats });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="w-full px-1 sm:px-4 lg:px-6 py-2 sm:py-6">
        <div className="space-y-2 sm:space-y-4 lg:space-y-6">
          {/* Welcome Section */}
          <div className="w-full">
            <WelcomeSection userName={fallbackUsername} streak={7} />
          </div>

          {/* Main Layout: Stats on left, Sidebar on right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {/* Left Side: Streak, Stats and WorkSessionChart */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-4 lg:space-y-6">
              {/* Streak and Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                  <StreakComponent currentStreak={7} className="w-full" />
                </div>

                <div className="lg:col-span-3 grid grid-cols-3 gap-2 sm:gap-3">
                  {/* XP Total */}
                  <div className="bg-slate-800/50 rounded-xl p-2 sm:p-3 border border-slate-600/30 backdrop-blur-sm flex items-center gap-2 sm:gap-3 w-full h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-600/50 border border-slate-500/30 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-slate-400 text-sm font-medium">XP</p>
                      <p className="text-slate-200 text-lg sm:text-xl font-bold truncate">{userStats?.totalXP || 0}</p>
                    </div>
                  </div>

                  {/* Skills Completed */}
                  <div className="bg-slate-800/50 rounded-xl p-2 sm:p-3 border border-slate-600/30 backdrop-blur-sm flex items-center gap-2 sm:gap-3 w-full h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-600/50 border border-slate-500/30 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-slate-400 text-sm font-medium">Skills</p>
                      <p className="text-slate-200 text-lg sm:text-xl font-bold truncate">
                        {skills.filter((skill) => skill.status === "COMPLETED").length}
                      </p>
                    </div>
                  </div>

                  {/* Quests Completed */}
                  <div className="bg-slate-800/50 rounded-xl p-2 sm:p-3 border border-slate-600/30 backdrop-blur-sm flex items-center gap-2 sm:gap-3 w-full h-full">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-600/50 border border-slate-500/30 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-slate-400 text-sm font-medium">Quêtes</p>
                      <p className="text-slate-200 text-lg sm:text-xl font-bold truncate">
                        {skills.reduce((total, skill) => total + (skill.completedQuests || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WorkSessionChart */}
              <div className="w-full">
                <div className="w-full h-[350px] sm:h-[450px] lg:h-[532px]">
                  <WorkSessionChart className="w-full h-full" />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-2 sm:space-y-4 lg:space-y-6">
              {/* Recent Skills */}
              <div className="w-full">
                <RecentSkillsComponent skills={skills} className="w-full" />
              </div>

              {/* Weekly Sessions */}
              <div className="w-full">
                <WeeklySessionsReminder className="w-full" />
              </div>

              {/* Profile HUD */}
              <div className="w-full">
                <ProfileHud
                  userName={user?.username || user?.firstName || "Aventurier"}
                  title={(user?.unsafeMetadata?.role as string) || "Aventurier"}
                  level={userCurrentLevel}
                  xp={totalXp % xpThreshold}
                  xpToNext={xpToNextLevel}
                  isCollapsible={true}
                  defaultExpanded={false}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
