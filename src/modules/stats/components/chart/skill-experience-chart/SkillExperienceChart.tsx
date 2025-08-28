import ReactECharts from "echarts-for-react";
import type { ChartData } from "@/modules/stats/types/stats.types";
import { getChartOption } from "./chart-option.const";

type SkillExperienceChartProps = {
  data: ChartData;
  height?: number;
};

export const SkillExperienceChart = ({ data, height = 400 }: SkillExperienceChartProps) => {
  const chartOptions = getChartOption(data);

  return (
    <div className="w-full rounded-xl bg-[#131928] p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">XP par Compétence</h3>
        <p className="text-sm text-gray-400">Visualisation de votre expérience accumulée par compétence</p>
      </div>

      <ReactECharts
        option={chartOptions}
        style={{ height: `${height}px`, width: "100%" }}
        opts={{
          renderer: "svg",
          devicePixelRatio: window.devicePixelRatio || 2,
        }}
      />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.userStats.totalXp.toLocaleString()}</div>
          <div className="text-gray-400">XP Total</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.userStats.skillsCompleted}</div>
          <div className="text-gray-400">Skills Complétées</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.experienceMetrics.length}</div>
          <div className="text-gray-400">Skills Actives</div>
        </div>
      </div>
    </div>
  );
};
