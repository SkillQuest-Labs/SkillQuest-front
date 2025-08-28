import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import type { ChartData } from "../../types/stats.types";

interface QuestCompletionChartProps {
  data: ChartData;
  height?: number;
}

export const QuestCompletionChart: React.FC<QuestCompletionChartProps> = ({ data, height = 400 }) => {
  const chartOptions = useMemo(() => {
    const { questCompletionMetrics } = data;

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
                      <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 2px;"></div>
                      <span style="color: #f59e0b; font-weight: 500;">Restantes: ${remainingParam.value}</span>
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
        data: ["Quêtes Complétées", "Quêtes Restantes"],
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
          stack: "quests",
          data: questCompletionMetrics.map((metric) => ({
            value: metric.completedQuests,
            itemStyle: {
              color: "#10b981",
              borderRadius: [0, 0, 4, 4],
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
          stack: "quests",
          data: questCompletionMetrics.map((metric) => ({
            value: metric.remainingQuests,
            itemStyle: {
              color: "#f59e0b",
              borderRadius: [4, 4, 0, 0],
            },
          })),
          emphasis: {
            focus: "series",
            itemStyle: {
              color: "#d97706",
              shadowBlur: 10,
              shadowColor: "rgba(245, 158, 11, 0.3)",
            },
          },
          animationDelay: (idx: number) => idx * 100 + 50,
        },
      ],
    };
  }, [data]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-700/50 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Progression des Quêtes par Compétence</h3>
        <p className="text-gray-400 text-sm">Visualisation des quêtes complétées et restantes pour chaque compétence</p>
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
