import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Button } from "@/shared/components/ui/button";
import { buildQuestCompletionData } from "./quest-completion-chart.const";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { getChartOptions } from "./chart-option.const";

type ChartViewType = "stacked" | "grouped";

export const QuestCompletionChart = () => {
  const [viewType, setViewType] = useState<ChartViewType>("stacked");

  const isGrouped = viewType === "grouped";

  const { skills: skillsData } = useGetSkills("uuid-user-1234-5678-9012-345678901234");

  const questCompletionMetrics = buildQuestCompletionData(skillsData);

  const chartOptions = useMemo(() => {
    return getChartOptions({ questCompletionMetrics, isGrouped });
  }, [isGrouped, questCompletionMetrics]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-700/50 p-6">
      {/* Switch de vue */}
      <div className="mb-4 flex justify-end">
        <div className="relative bg-slate-800/50 rounded-lg p-1 border border-slate-600/30">
          <div
            className={`absolute top-1 bottom-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md transition-all duration-300 ease-in-out ${
              viewType === "stacked" ? "left-1 w-[calc(50%-2px)]" : "left-[calc(50%+2px)] w-[calc(50%-2px)]"
            }`}
          />
          <div className="relative flex">
            <Button
              variant="ghost"
              onClick={() => setViewType("stacked")}
              className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md transition-all duration-200 ${
                viewType === "stacked" ? "text-white z-10" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Vue Empilée
            </Button>
            <Button
              variant="ghost"
              onClick={() => setViewType("grouped")}
              className={`px-4 py-2 cursor-pointer text-sm font-medium rounded-md transition-all duration-200 ${
                viewType === "grouped" ? "text-white z-10" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Vue Multiple
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Progression des Quêtes par Compétence</h3>
        <p className="text-gray-400 text-sm">
          {viewType === "stacked"
            ? "Visualisation des quêtes complétées et restantes pour chaque compétence (vue empilée)"
            : "Comparaison côte à côte des quêtes complétées et restantes par compétence"}
        </p>
      </div>

      <ReactECharts
        option={chartOptions}
        style={{ height: "400px", width: "100%" }}
        opts={{
          renderer: "svg",
          devicePixelRatio: window.devicePixelRatio || 2,
        }}
      />

      {/* Summary statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {questCompletionMetrics.reduce((sum, metric) => sum + (metric?.completedQuests ?? 0), 0)}
          </div>
          <div className="text-gray-400 text-sm">Quêtes Complétées</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {questCompletionMetrics.reduce((sum, metric) => sum + metric.remainingQuests, 0)}
          </div>
          <div className="text-gray-400 text-sm">Quêtes Restantes</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {questCompletionMetrics.reduce((sum, metric) => sum + (metric.totalQuests ?? 0), 0)}
          </div>
          <div className="text-gray-400 text-sm">Total Quêtes</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {(
              (questCompletionMetrics.reduce((sum, metric) => sum + (metric?.completedQuests ?? 0), 0) /
                questCompletionMetrics.reduce((sum, metric) => sum + (metric.totalQuests ?? 0), 0)) *
              100
            ).toFixed(1)}
            %
          </div>
          <div className="text-gray-400 text-sm">Progression Globale</div>
        </div>
      </div>
    </div>
  );
};
