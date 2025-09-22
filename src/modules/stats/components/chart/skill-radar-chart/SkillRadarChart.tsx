import ReactECharts from "echarts-for-react";
import { Award, Target, TrendingUp } from "lucide-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { buildSkillRadarData } from "./skill-radar-chart.const";
import { getChartOptions } from "./chart-options.const";
import { useUser } from "@clerk/clerk-react";

export const SkillRadarChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");

  const skillRadarMetrics = buildSkillRadarData(skillsData);
  const hasData = skillRadarMetrics.length > 0;

  const radarChartOptions = getChartOptions(skillRadarMetrics);

  const averageMastery = hasData
    ? Math.round(skillRadarMetrics.reduce((sum, skill) => sum + skill.masteryLevel, 0) / skillRadarMetrics.length)
    : 0;

  const topSkill = hasData
    ? skillRadarMetrics.reduce((prev, current) => (prev.masteryLevel > current.masteryLevel ? prev : current))
    : null;

  const skillsAbove80 = hasData ? skillRadarMetrics.filter((skill) => skill.masteryLevel >= 80).length : 0;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-600/40 bg-gradient-to-br from-slate-900/70 via-slate-900/45 to-slate-900/80 shadow-lg shadow-black/30">
      <div className="flex items-start justify-between gap-4 border-b border-slate-700/40 bg-slate-900/55 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-purple-500/25 blur" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/40 bg-slate-900/80">
              <TrendingUp className="h-6 w-6 text-purple-200" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Profil de Compétences</h3>
            <p className="text-xs text-slate-400">
              Visualisez la maîtrise par compétence et identifiez vos zones fortes
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-6 py-5">
        {hasData && radarChartOptions ? (
          <div className="flex h-full flex-col gap-6">
            <div className="relative flex-1 min-h-0 overflow-hidden rounded-lg border border-slate-700/40 bg-slate-900/60">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              <ReactECharts
                option={radarChartOptions()}
                style={{ height: "100%", width: "100%" }}
                opts={{
                  renderer: "svg",
                  devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2,
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-700/40 bg-slate-900/65 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-purple-500/30 bg-purple-500/10">
                    <TrendingUp className="h-5 w-5 text-purple-200" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Maîtrise moyenne</p>
                    <p className="text-lg font-semibold text-white">{averageMastery}%</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-700/40 bg-slate-900/65 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-500/30 bg-cyan-500/10">
                    <Target className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs text-slate-400">Compétence dominante</p>
                    <p className="text-lg font-semibold text-white" title={topSkill?.skillName || "—"}>
                      {topSkill?.skillName
                        ? topSkill.skillName.length > 18
                          ? `${topSkill.skillName.slice(0, 16)}…`
                          : topSkill.skillName
                        : "—"}
                    </p>
                    <p className="text-xs text-cyan-300">{topSkill ? `${topSkill.masteryLevel}%` : "Aucune donnée"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-700/40 bg-slate-900/65 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-amber-500/30 bg-amber-500/10">
                    <Award className="h-5 w-5 text-amber-200" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Compétences ≥ 80%</p>
                    <p className="text-lg font-semibold text-white">{skillsAbove80}</p>
                    <p className="text-xs text-amber-300">niveau expert</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700/40 bg-slate-900/60 text-center">
            <p className="text-sm font-medium text-slate-200">Pas encore de profil de compétences</p>
            <p className="text-xs text-slate-400">Complétez quelques quêtes pour afficher vos statistiques</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRadarChart;
