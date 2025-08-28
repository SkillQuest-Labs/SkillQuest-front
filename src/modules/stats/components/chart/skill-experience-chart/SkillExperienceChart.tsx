import ReactECharts from "echarts-for-react";
import { getChartOption } from "./chart-option.const";
import { useGetSkills } from "@/shared/services/skill/api-skill";

export const SkillExperienceChart = () => {
  const { skills: skillsData } = useGetSkills("uuid-user-1234-5678-9012-345678901234");
  const chartOptions = getChartOption(skillsData);

  return (
    <div className="w-full rounded-xl bg-[#131928] p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">XP par Compétence</h3>
        <p className="text-sm text-gray-400">Visualisation de votre expérience accumulée par compétence</p>
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
