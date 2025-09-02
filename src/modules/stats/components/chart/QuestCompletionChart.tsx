import React, { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { ChartData } from "../../types/stats.types";
import { Button } from "@/shared/components/ui/button";

type ChartViewType = "stacked" | "grouped";

interface QuestCompletionChartProps {
  data: ChartData;
  height?: number;
}

export const QuestCompletionChart: React.FC<QuestCompletionChartProps> = ({ data, height = 400 }) => {
  const [viewType, setViewType] = useState<ChartViewType>("stacked");
  const chartOptions = useMemo(() => {
    const { questCompletionMetrics } = data;
    const isGrouped = viewType === "grouped";

    return {
      animation: true,
      animationDuration: 800,
      animationEasing: "cubicOut",
      grid: {
        left: "12%",
        right: "8%",
        top: "15%",
        bottom: "15%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          shadowStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        textStyle: {
          color: "#f1f5f9",
          fontSize: 13,
          fontWeight: 500,
        },
        formatter: (params: any) => {
          // Gestion pour vue groupée (barres côte à côte)
          if (!Array.isArray(params)) {
            const skillName = params.axisValue;
            const metric = questCompletionMetrics.find((m) => m.skillName === skillName);
            const isCompleted = params.seriesName === "Quêtes Complétées";

            if (metric) {
              const otherValue = isCompleted ? metric.remainingQuests : metric.completedQuests;
              const otherLabel = isCompleted ? "Restantes" : "Complétées";
              const otherColor = isCompleted ? "#cbd5e1" : "#10b981";

              return `
                <div style="padding: 8px; font-family: 'Inter', sans-serif;">
                  <div style="font-weight: 600; font-size: 14px; color: #f1f5f9; margin-bottom: 8px;">${skillName}</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 12px; height: 12px; background: ${params.color}; border-radius: 2px;"></div>
                      <span style="color: ${params.color}; font-weight: 500;">${params.seriesName}: ${params.value}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 12px; height: 12px; background: ${otherColor}; border-radius: 2px;"></div>
                      <span style="color: ${otherColor}; font-weight: 500;">${otherLabel}: ${otherValue}</span>
                    </div>
                    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(148, 163, 184, 0.2);">
                      <span style="color: #cbd5e1; font-size: 12px;">Total: ${metric.totalQuests} quêtes</span><br>
                      <span style="color: #cbd5e1; font-size: 12px;">Progression: ${metric.completionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              `;
            }
          }

          // Gestion pour vue empilée (barres empilées)
          if (Array.isArray(params) && params.length >= 2) {
            const completedParam = params.find((p) => p.seriesName === "Quêtes Complétées");
            const remainingParam = params.find((p) => p.seriesName === "Quêtes Restantes");
            const skillName = params[0].axisValue;
            const metric = questCompletionMetrics.find((m) => m.skillName === skillName);

            if (completedParam && remainingParam && metric) {
              return `
                <div style="padding: 8px; font-family: 'Inter', sans-serif;">
                  <div style="font-weight: 600; font-size: 14px; color: #f1f5f9; margin-bottom: 8px;">${skillName}</div>
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 12px; height: 12px; background: #10b981; border-radius: 2px;"></div>
                      <span style="color: #10b981; font-weight: 500;">Complétées: ${completedParam.value}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="width: 12px; height: 12px; background: #cbd5e1; border-radius: 2px;"></div>
                      <span style="color: #cbd5e1; font-weight: 500;">Restantes: ${remainingParam.value}</span>
                    </div>
                    <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(148, 163, 184, 0.2);">
                      <span style="color: #cbd5e1; font-size: 12px;">Total: ${metric.totalQuests} quêtes</span><br>
                      <span style="color: #cbd5e1; font-size: 12px;">Progression: ${metric.completionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              `;
            }
          }
          return "";
        },
      },
      legend: {
        data: [
          {
            name: "Quêtes Complétées",
            itemStyle: {
              color: "#10b981",
            },
          },
          {
            name: "Quêtes Restantes",
            itemStyle: {
              color: "#cbd5e1",
            },
          },
        ],
        top: "5%",
        textStyle: {
          color: "#cbd5e1",
          fontSize: 13,
          fontWeight: 500,
        },
        itemGap: 25,
        itemWidth: 14,
        itemHeight: 14,
      },
      xAxis: {
        type: "category",
        data: questCompletionMetrics.map((metric) => metric.skillName),
        axisLine: {
          lineStyle: {
            color: "rgba(148, 163, 184, 0.3)",
            width: 1,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#cbd5e1",
          fontSize: 12,
          fontWeight: 500,
          interval: 0,
          rotate: window.innerWidth < 768 ? 45 : 0,
          margin: 12,
        },
      },
      yAxis: {
        type: "value",
        name: "Nombre de Quêtes",
        nameTextStyle: {
          color: "#cbd5e1",
          fontSize: 13,
          fontWeight: 500,
          padding: [0, 0, 0, -10],
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#94a3b8",
          fontSize: 11,
          fontWeight: 400,
        },
        splitLine: {
          lineStyle: {
            color: "rgba(148, 163, 184, 0.1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      series: [
        {
          name: "Quêtes Complétées",
          type: "bar",
          stack: isGrouped ? undefined : "quests",
          barGap: isGrouped ? "10%" : undefined,
          data: questCompletionMetrics.map((metric) => ({
            value: metric.completedQuests,
            itemStyle: {
              color: "#10b981",
              borderRadius: isGrouped ? [4, 4, 4, 4] : [0, 0, 4, 4],
            },
          })),
          emphasis: {
            focus: "series",
            itemStyle: {
              color: "#059669",
              shadowBlur: 10,
              shadowColor: "rgba(16, 185, 129, 0.3)",
            },
          },
          animationDelay: (idx: number) => idx * 100,
        },
        {
          name: "Quêtes Restantes",
          type: "bar",
          stack: isGrouped ? undefined : "quests",
          data: questCompletionMetrics.map((metric) => ({
            value: metric.remainingQuests,
            itemStyle: {
              color: "#cbd5e1",
              borderRadius: isGrouped ? [4, 4, 4, 4] : [4, 4, 0, 0],
            },
          })),
          emphasis: {
            focus: "series",
            itemStyle: {
              color: "#4b5563",
              shadowBlur: 10,
              shadowColor: "rgba(107, 114, 128, 0.3)",
            },
          },
          animationDelay: (idx: number) => idx * 100 + 50,
        },
      ],
    };
  }, [data, viewType]);

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
        style={{ height: `${height}px`, width: "100%" }}
        opts={{
          renderer: "svg",
          devicePixelRatio: window.devicePixelRatio || 2,
        }}
      />

      {/* Statistiques récapitulatives */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {data.questCompletionMetrics.reduce((sum, metric) => sum + metric.completedQuests, 0)}
          </div>
          <div className="text-gray-400 text-sm">Quêtes Complétées</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {data.questCompletionMetrics.reduce((sum, metric) => sum + metric.remainingQuests, 0)}
          </div>
          <div className="text-gray-400 text-sm">Quêtes Restantes</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {data.questCompletionMetrics.reduce((sum, metric) => sum + metric.totalQuests, 0)}
          </div>
          <div className="text-gray-400 text-sm">Total Quêtes</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">
            {(
              (data.questCompletionMetrics.reduce((sum, metric) => sum + metric.completedQuests, 0) /
                data.questCompletionMetrics.reduce((sum, metric) => sum + metric.totalQuests, 0)) *
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
