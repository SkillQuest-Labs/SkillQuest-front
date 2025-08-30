import ReactECharts from "echarts-for-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { buildLevelProgressionData } from "./level-progression.const";
import { getChartOptions } from "./chart-option.const";

export const LevelProgressionChart = () => {
  const { skills: skillsData } = useGetSkills("uuid-user-1234-5678-9012-345678901234");

  const userTotalXp = skillsData.reduce((acc, skill) => acc + (skill.totalXp || 0), 0);

  const levelProgressionData = buildLevelProgressionData({ userTotalXp });

  const chartOptions = getChartOptions(levelProgressionData);

  return (
    <div className="w-full rounded-xl bg-[#131928] p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Progression des Niveaux</h3>
        <p className="text-sm text-gray-400">Évolution de votre progression XP et seuils de niveaux</p>
      </div>

      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
        opts={{
          renderer: "svg",
          devicePixelRatio: window.devicePixelRatio || 2,
        }}
      />
    </div>
  );
};
