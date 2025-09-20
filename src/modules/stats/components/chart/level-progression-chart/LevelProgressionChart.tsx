import ReactECharts from "echarts-for-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { buildLevelProgressionData } from "./level-progression.const";
import { getChartOptions } from "./chart-option.const";
import { useUser } from "@clerk/clerk-react";

export const LevelProgressionChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");

  const userTotalXp = skillsData.reduce((acc, skill) => acc + (skill.totalXp || 0), 0);

  const levelProgressionData = buildLevelProgressionData({ userTotalXp });

  const chartOptions = getChartOptions({ levelProgressionData, maxLevel: 10 });

  return (
    <div className="w-full h-full rounded-xl bg-[#131928] p-4 lg:p-6 shadow-lg flex flex-col">
      {chartOptions ? (
        <>
          <div className="flex-shrink-0 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Progression des Niveaux</h3>
            <p className="text-xs lg:text-sm text-gray-400">Évolution de votre progression XP et seuils de niveaux</p>
          </div>

          <div className="flex-1 min-h-0">
            <ReactECharts
              option={chartOptions}
              style={{ height: "100%", width: "100%" }}
              opts={{
                renderer: "svg",
                devicePixelRatio: window.devicePixelRatio || 2,
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-gray-400 text-center">Pas de données de progression disponibles.</p>
        </div>
      )}
    </div>
  );
};
