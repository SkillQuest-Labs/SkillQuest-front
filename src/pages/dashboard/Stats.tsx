import { mockChartData } from "@/modules/stats/components/chart";
import { StatsCard } from "@/modules/stats/components/StatsCard";
import { StatsCharts } from "@/modules/stats/components/StatsCharts";
import { UserLevelCard } from "@/modules/stats/components/UserLevelCard";
import { Award, BarChart3, Target, TrendingUp } from "lucide-react";

export const Stats = () => {
  const { userStats } = mockChartData;

  return (
    <div className="h-full overflow-hidden">
      <div className="w-[95%] max-w-full mx-auto p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Statistiques d'Expérience</h1>
              <p className="text-gray-400 mt-1 text-sm lg:text-base">
                Suivez votre progression et analysez vos performances
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Stats Cards sections */}
            <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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

            <div className="flex-1 min-h-0">
              <StatsCharts defaultActiveTab="skill-experience" />
            </div>
          </div>

          {/* second partie */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="h-full">
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
