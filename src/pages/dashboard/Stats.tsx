import { mockChartData } from "@/modules/stats/components/chart";
import { StatsCard } from "@/modules/stats/components/StatsCard";
import { UserLevelCard } from "@/modules/stats/components/UserLevelCard";
import { StatsCharts } from "@/modules/stats/components/StatsCharts";
import { Award, BarChart3, Target, TrendingUp } from "lucide-react";

export const Stats = () => {
  const { userStats } = mockChartData;

  return (
    <div className="max-h-screen">
      <div className="w-[95%] mx-auto py-5">
        {/* Header */}
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Statistiques d'Expérience</h1>
              <p className="text-gray-400 mt-1">Suivez votre progression et analysez vos performances</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8 h-full">
          <div className="w-4/5 h-full rounded-xl p-4">
            {/* Stats Cards sections */}
            <div className="h-[25%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="XP Total"
                value={userStats.totalXp}
                icon={TrendingUp}
                color="blue"
                change={{
                  value: "+12%",
                  label: "ce mois",
                  positive: true,
                }}
              />

              <StatsCard
                title="Skills Complétées"
                value={userStats.skillsCompleted}
                icon={Target}
                color="green"
                change={{
                  value: "+2",
                  label: "cette semaine",
                  positive: true,
                }}
              />

              <StatsCard
                title="Quêtes Terminées"
                value={userStats.questsCompleted}
                icon={BarChart3}
                color="orange"
                change={{
                  value: "+8",
                  label: "ce mois",
                  positive: true,
                }}
              />
            </div>

            <div className="h-[75%]">
              <StatsCharts defaultActiveTab="skill-experience" />
            </div>
          </div>

          {/* second partie */}
          <div className="w-1/5 h-full p-4">
            <div className="mb-4">
              <UserLevelCard
                currentLevel={userStats.currentLevel}
                currentXp={userStats.totalXp % 2700}
                maxXp={2700}
                totalXp={userStats.totalXp}
                icon={Award}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
