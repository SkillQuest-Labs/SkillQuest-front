import ReactECharts from "echarts-for-react";
import React, { useMemo } from "react";
import type { ChartData } from "../../types/stats.types";

interface LevelProgressionChartProps {
  data: ChartData;
  height?: number;
}

export const LevelProgressionChart: React.FC<LevelProgressionChartProps> = ({ data, height = 400 }) => {
  const chartOptions = useMemo(() => {
    const { levelProgression, xpThresholds } = data;

    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 600,
      animationEasing: "cubicOut",
      grid: {
        left: "8%",
        right: "5%",
        top: "18%",
        bottom: "20%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        borderRadius: 8,
        padding: [12, 16],
        textStyle: {
          color: "#f8fafc",
          fontSize: 14,
          fontWeight: 500,
        },
        extraCssText: "box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);",
        formatter: function (params: any) {
          if (Array.isArray(params) && params.length > 0) {
            const param = params[0];
            if (param.seriesName === "Progression Niveau") {
              const progression = levelProgression[param.dataIndex];
              return `
                <div class="p-2">
                  <div class="font-semibold text-white">Niveau ${progression.level}</div>
                  <div class="text-sm text-blue-300">XP Cumulé: ${progression.xpCurrent}</div>
                  <div class="text-sm text-blue-300">Date: ${new Date(progression.date).toLocaleDateString("fr-FR")}</div>
                  ${progression.isCurrentLevel ? '<div class="text-sm text-cyan-400">Niveau Actuel</div>' : ""}
                </div>
              `;
            } else if (param.seriesName === "Seuils XP") {
              const threshold = xpThresholds[param.dataIndex];
              return `
                <div class="p-2">
                  <div class="font-semibold text-white">Seuil Niveau ${threshold.level}</div>
                  <div class="text-sm text-red-300">XP Requis: ${threshold.xpCumulative}</div>
                  <div class="text-sm text-red-300">XP pour ce niveau: ${threshold.xpRequired}</div>
                </div>
              `;
            }
          }
          return "";
        },
      },
      legend: {
        data: ["Progression Niveau", "Seuils XP"],
        top: "2%",
        textStyle: {
          color: "#e2e8f0",
          fontSize: 14,
          fontWeight: 600,
        },
        itemGap: 24,
        itemWidth: 18,
        itemHeight: 12,
      },
      xAxis: {
        type: "category",
        data: levelProgression.map((prog) => `Niv ${prog.level}`),
        axisLabel: {
          color: "#cbd5e1",
          fontSize: 13,
          fontWeight: 500,
          margin: 12,
        },
        axisLine: {
          lineStyle: {
            color: "#334155",
            width: 2,
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        name: "XP Cumulé",
        nameTextStyle: {
          color: "#e2e8f0",
          fontSize: 14,
          fontWeight: 600,
          padding: [0, 0, 8, 0],
        },
        axisLabel: {
          color: "#cbd5e1",
          fontSize: 13,
          fontWeight: 500,
          formatter: function (value: number) {
            return value >= 1000 ? (value / 1000).toFixed(1) + "k" : value.toString();
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#334155",
            type: "solid",
            width: 1,
            opacity: 0.6,
          },
        },
      },
      series: [
        {
          name: "Progression Niveau",
          type: "line",
          data: levelProgression.map((prog) => prog.xpCurrent),
          smooth: true,
          symbol: "circle",
          symbolSize: 10,
          lineStyle: {
            color: "#06b6d4",
            width: 4,
            shadowColor: "rgba(6, 182, 212, 0.4)",
            shadowBlur: 10,
            shadowOffsetY: 3,
          },
          itemStyle: {
            color: "#06b6d4",
            borderColor: "#0f172a",
            borderWidth: 3,
            shadowColor: "rgba(6, 182, 212, 0.6)",
            shadowBlur: 8,
          },
          emphasis: {
            itemStyle: {
              shadowColor: "rgba(6, 182, 212, 0.8)",
              shadowBlur: 12,
              borderWidth: 4,
            },
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(6, 182, 212, 0.4)",
                },
                {
                  offset: 1,
                  color: "rgba(6, 182, 212, 0.08)",
                },
              ],
            },
          },
          animationDelay: 400,
        },
        {
          name: "Seuils XP",
          type: "line",
          data: xpThresholds.slice(0, levelProgression.length).map((threshold) => threshold.xpCumulative),
          lineStyle: {
            color: "#ef4444",
            width: 3,
            type: "dashed",
            shadowColor: "rgba(239, 68, 68, 0.3)",
            shadowBlur: 6,
          },
          symbol: "diamond",
          symbolSize: 8,
          itemStyle: {
            color: "#ef4444",
            borderColor: "#0f172a",
            borderWidth: 2,
            shadowColor: "rgba(239, 68, 68, 0.5)",
            shadowBlur: 6,
          },
          emphasis: {
            itemStyle: {
              shadowColor: "rgba(239, 68, 68, 0.7)",
              shadowBlur: 10,
              borderWidth: 3,
            },
          },
          animationDelay: 600,
        },
      ],
    };
  }, [data]);

  return (
    <div className="w-full rounded-xl bg-[#131928] p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Progression des Niveaux</h3>
        <p className="text-sm text-gray-400">Évolution de votre progression XP et seuils de niveaux</p>
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
          <div className="font-semibold text-white">Niveau {data.userStats.currentLevel}</div>
          <div className="text-gray-400">Niveau Actuel</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.userStats.questsCompleted}</div>
          <div className="text-gray-400">Quêtes Terminées</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.levelProgression.length}</div>
          <div className="text-gray-400">Niveaux Atteints</div>
        </div>
      </div>
    </div>
  );
};
