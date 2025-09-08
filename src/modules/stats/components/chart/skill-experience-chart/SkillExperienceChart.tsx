import { useGetSkills } from "@/shared/services/skill/api-skill";
import { useUser } from "@clerk/clerk-react";
import ReactECharts from "echarts-for-react";
import { getChartOption } from "./chart-option.const";

export const SkillExperienceChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");
  const chartOptions = getChartOption(skillsData);

  return (
    <div className="w-full h-full rounded-xl bg-[#131928] p-4 lg:p-6 shadow-lg flex flex-col">
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-2">XP par Compétence</h3>
        <p className="text-xs lg:text-sm text-gray-400">Visualisation de votre expérience accumulée par compétence</p>
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
    </div>
  );
};
