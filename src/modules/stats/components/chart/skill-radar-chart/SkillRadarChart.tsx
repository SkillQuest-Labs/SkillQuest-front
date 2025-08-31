import ReactECharts from "echarts-for-react";
import { Award, Target, TrendingUp } from "lucide-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { buildSkillRadarData } from "./skill-radar-chart.const";
import { getChartOptions } from "./chart-options.const";

export const SkillRadarChart = () => {
  const { skills: skillsData } = useGetSkills("uuid-user-1234-5678-9012-345678901234");

  const skillRadarMetrics = buildSkillRadarData(skillsData);

  const radarChartOptions = getChartOptions(skillRadarMetrics);

  const averageMastery = Math.round(
    skillRadarMetrics.reduce((sum, skill) => sum + skill.masteryLevel, 0) / skillRadarMetrics.length,
  );

  const topSkill = skillRadarMetrics.reduce((prev, current) =>
    prev.masteryLevel > current.masteryLevel ? prev : current,
  );

  const skillsAbove80 = skillRadarMetrics.filter((skill) => skill.masteryLevel >= 80).length;

  return (
    <div className="w-full h-full bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 lg:p-6 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-base lg:text-xl font-bold text-white mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Profil de Compétences
        </h3>
        <p className="text-gray-400 text-xs lg:text-sm">
          Visualisation radar de votre niveau de maîtrise par compétence
        </p>
      </div>

      {/* Radar Chart */}
      <div className="flex-1 min-h-0 mb-4">
        <ReactECharts option={radarChartOptions()} style={{ height: "100%", width: "100%" }} opts={{ renderer: "svg" }} />
      </div>

      {/* Statistiques récapitulatives */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Maîtrise Moyenne</p>
              <p className="text-white text-lg font-bold">{averageMastery}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Meilleure Compétence</p>
              <p className="text-white text-lg font-bold truncate" title={topSkill.skillName}>
                {topSkill.skillName.length > 20 ? topSkill.skillName.substring(0, 12) + "..." : topSkill.skillName}
              </p>
              <p className="text-green-400 text-sm">{topSkill.masteryLevel}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Skills Expertes</p>
              <p className="text-white text-lg font-bold">{skillsAbove80}</p>
              <p className="text-purple-400 text-sm">≥ 80% maîtrise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillRadarChart;
