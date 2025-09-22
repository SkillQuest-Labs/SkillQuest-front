import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import { BarChart3, Search } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useGetSkills } from "@/shared/services/skill/api-skill";

interface QuestCompletionMetric {
  skillId: string;
  skillName: string;
  completedQuests: number;
  remainingQuests: number;
  totalQuests: number;
  totalXp: number;
}

const buildQuestCompletionData = (skills: any[]): QuestCompletionMetric[] => {
  if (!skills || skills.length === 0) return [];

  return skills.map((skill: any) => {
    const totalQuests = Number.isFinite(skill.totalQuests) ? skill.totalQuests : skill.quests?.length || 0;
    const completedQuests = Number.isFinite(skill.completedQuests)
      ? skill.completedQuests
      : skill.quests?.filter((quest: any) => quest.isCompleted).length || 0;
    const remainingQuests = Math.max((totalQuests || 0) - (completedQuests || 0), 0);

    return {
      skillId: skill.id || skill.skillId || "",
      skillName: skill.title || skill.name || "Compétence",
      completedQuests,
      remainingQuests,
      totalQuests,
      totalXp: Number.isFinite(skill.totalXp)
        ? skill.totalXp
        : skill.quests?.reduce((sum: number, quest: any) => sum + (quest.xp || 0), 0) || 0,
    };
  });
};

type FilterStatus = "all" | "completed" | "in_progress";

const COSMIC_COLORS = {
  deepPurple: "#6B46C1",
  electricBlue: "#3B82F6",
  neonPink: "#EC4899",
  cosmicGold: "#F59E0B",
  starWhite: "#F8FAFC",
  nebulaPurple: "#8B5CF6",
  galaxyTeal: "#14B8A6",
  cyan900: "#164e63",
  cyan600: "#0891b2",
};

const useFilteredMetrics = ({
  metrics,
  searchTerm,
  filterStatus,
  completionRange,
}: {
  metrics: QuestCompletionMetric[];
  searchTerm: string;
  filterStatus: FilterStatus;
  completionRange: [number, number];
}) => {
  return useMemo(() => {
    return metrics.filter((metric) => {
      if (searchTerm && !metric.skillName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      const completionPercentage = getCompletionPercentage(metric);
      if (filterStatus === "completed" && completionPercentage < 100) return false;
      if (filterStatus === "in_progress" && (completionPercentage === 0 || completionPercentage === 100)) return false;

      if (completionPercentage < completionRange[0] || completionPercentage > completionRange[1]) {
        return false;
      }

      return true;
    });
  }, [metrics, searchTerm, filterStatus, completionRange]);
};

const getCompletionPercentage = (metric: QuestCompletionMetric) =>
  metric.totalQuests > 0 ? (metric.completedQuests / metric.totalQuests) * 100 : 0;

export const QuestCompletionChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const questCompletionMetrics = useMemo(() => buildQuestCompletionData(skillsData), [skillsData]);

  const filteredMetrics = useFilteredMetrics({
    metrics: questCompletionMetrics,
    searchTerm,
    filterStatus,
    completionRange: [0, 100],
  });

  const averageCompletion = useMemo(() => {
    if (!filteredMetrics.length) return 0;
    const total = filteredMetrics.reduce((acc, metric) => acc + getCompletionPercentage(metric), 0);
    return total / filteredMetrics.length;
  }, [filteredMetrics]);

  const chartOption: EChartsOption | null = useMemo(() => {
    if (!filteredMetrics.length) return null;

    const skillNames = filteredMetrics.map((metric) => metric.skillName);
    const completionPercentages = filteredMetrics.map((metric) => Math.round(getCompletionPercentage(metric)));

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(2, 6, 23, 0.92)",
        borderColor: COSMIC_COLORS.electricBlue,
        borderWidth: 1,
        textStyle: { color: COSMIC_COLORS.starWhite, fontSize: 12 },
        formatter: (params: any) => {
          const firstItem = Array.isArray(params) ? params[0] : params;
          const metric = filteredMetrics[firstItem?.dataIndex ?? 0];
          if (!metric) return "";
          const completion = Math.round(getCompletionPercentage(metric));
          return [
            `<div style="display:flex;align-items:center;gap:6px;color:${COSMIC_COLORS.cosmicGold};font-weight:600;">${metric.skillName}</div>`,
            `<div style="color:${COSMIC_COLORS.starWhite};">Progression&nbsp;: <strong>${completion}%</strong></div>`,
            `<div style="color:${COSMIC_COLORS.starWhite};">Quêtes terminées&nbsp;: <strong>${metric.completedQuests}</strong> / ${metric.totalQuests}</div>`,
            `<div style="color:${COSMIC_COLORS.starWhite};">Quêtes restantes&nbsp;: <strong>${metric.remainingQuests}</strong></div>`,
            `<div style="color:${COSMIC_COLORS.starWhite};">XP total&nbsp;: <strong>${metric.totalXp}</strong></div>`,
          ].join(" ");
        },
      },
      grid: { left: "3%", right: "4%", bottom: "4%", top: 60, containLabel: true },
      xAxis: {
        type: "value",
        max: 100,
        axisLabel: { color: "#94A3B8", formatter: "{value}%" },
        splitLine: { lineStyle: { color: "rgba(56, 189, 248, 0.15)" } },
        axisLine: { show: false },
      },
      yAxis: {
        type: "category",
        data: skillNames,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: COSMIC_COLORS.starWhite, fontWeight: 500 },
      },
      series: [
        {
          name: "Progression",
          type: "bar",
          data: completionPercentages,
          barWidth: 16,
          itemStyle: {
            borderRadius: [6, 6, 6, 6],
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: COSMIC_COLORS.electricBlue },
                { offset: 0, color: COSMIC_COLORS.cyan900 },
                { offset: 1, color: COSMIC_COLORS.electricBlue },
              ],
            },
            shadowBlur: 12,
            shadowColor: "rgba(59, 130, 246, 0.35)",
          },
          label: {
            show: true,
            position: "right",
            color: COSMIC_COLORS.galaxyTeal,
            fontWeight: 600,
            formatter: (params: any) => `${params.value}%`,
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowBlur: 18,
              shadowColor: "rgba(236, 72, 153, 0.45)",
            },
          },
        },
      ],
      markLine: averageCompletion
        ? {
            symbol: "none",
            lineStyle: {
              color: COSMIC_COLORS.cosmicGold,
              type: "dashed",
              width: 1.2,
            },
            label: {
              color: COSMIC_COLORS.cosmicGold,
              backgroundColor: "rgba(15, 23, 42, 0.85)",
              borderRadius: 6,
              padding: [4, 8],
              formatter: () => `Moyenne ${Math.round(averageCompletion)}%`,
            },
            data: [{ xAxis: Math.round(averageCompletion) }],
          }
        : undefined,
    };
  }, [filteredMetrics, averageCompletion]);

  return (
    <div className="p-2 w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-600/30">
      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-slate-900/80 to-slate-800/60 rounded-lg border border-cyan-500/30 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-cyan-200 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Progression des Quêtes par Skill
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher une compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300"
            />
          </div>

          <div className="flex bg-slate-800/30 rounded-lg p-1">
            {["all", "completed", "in_progress"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as FilterStatus)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  filterStatus === status
                    ? "bg-cyan-600/80 text-white shadow-lg shadow-cyan-500/30"
                    : "text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50"
                }`}
              >
                <span className="text-sm font-medium">
                  {status === "all" ? "Tous" : status === "completed" ? "Terminée" : "En cours"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden rounded-lg border border-slate-600/30 bg-slate-950/40">
        {filteredMetrics.length > 0 && chartOption ? (
          <ReactECharts
            option={chartOption}
            style={{ width: "100%", height: "100%" }}
            opts={{
              renderer: "svg",
              devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2,
            }}
            notMerge
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-cyan-200/70 text-sm">
            Aucune donnée de progression disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestCompletionChart;
