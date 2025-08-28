import type { ChartData } from "@/modules/stats/types/stats.types";
import { baseBarChartOptions } from "@/shared/utils/base-bar-chart-options.const";

export const getChartOption = (data: ChartData) => {
  const { experienceMetrics } = data;

  const chartOptions = baseBarChartOptions({
    legendData: ["XP par Skill"],
    tooltipFormatter: (params: any) => {
      if (Array.isArray(params) && params.length > 0) {
        const param = params[0];
        const metric = experienceMetrics[param.dataIndex];
        return `
              <div class="p-2">
                <div class="font-semibold text-white">${metric.skillName}</div>
                <div class="text-sm text-blue-300">XP Total: ${metric.totalXp}</div>
                <div class="text-sm text-blue-300">Quêtes: ${metric.completedQuests}</div>
                <div class="text-sm text-blue-300">XP Moyen: ${metric.averageQuestXp}</div>
                <div class="text-sm text-blue-300">Difficulté: ${metric.difficulty}</div>
              </div>
            `;
      }
      return "";
    },
    xAxisData: experienceMetrics.map((metric) => metric.skillName),
    yAxisName: "XP Total",
    series: [
      {
        name: "XP par Skill",
        type: "bar",
        data: experienceMetrics.map((metric) => ({
          value: metric.totalXp,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: metric.color,
                },
                {
                  offset: 1,
                  color: metric.color + "80",
                },
              ],
            },
            borderRadius: [6, 6, 0, 0],
            shadowColor: "rgba(0, 0, 0, 0.3)",
            shadowBlur: 8,
            shadowOffsetY: 3,
          },
        })),
        barWidth: "65%",
        emphasis: {
          itemStyle: {
            shadowColor: "rgba(0, 0, 0, 0.4)",
            shadowBlur: 12,
            shadowOffsetY: 4,
          },
        },
        animationDelay: function (idx: number) {
          return idx * 80;
        },
      },
    ],
  });
  return chartOptions;
};
