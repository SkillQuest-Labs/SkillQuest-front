import type { Skill } from "@/shared/types/skill.type";
import { baseBarChartOptions } from "@/shared/utils/base-bar-chart-options.const";

export const getChartOption = (skills: Skill[]) => {
  const chartOptions = baseBarChartOptions({
    legendData: ["XP par Skill"],
    tooltipFormatter: (params: any) => {
      if (Array.isArray(params) && params.length > 0) {
        const param = params[0];
        const skill = skills[param.dataIndex];
        return `
              <div class="p-2">
                <div class="font-semibold text-white">${skill.title}</div>
                <div class="text-sm text-blue-300">XP Total: ${skill.totalXp || 0}</div>
                <div class="text-sm text-blue-300">Quêtes: ${skill.completedQuests || 0}</div>
                <div class="text-sm text-blue-300">XP Moyen: ${skill.averageQuestXp || 0}</div>
                <div class="text-sm text-blue-300">Difficulté: ${skill.difficulty}</div>
              </div>
            `;
      }
      return "";
    },
    xAxisData: skills.map((skill) => skill.title),
    yAxisName: "XP Total",
    series: [
      {
        name: "XP par Skill",
        type: "bar",
        data: skills.map((skill) => ({
          value: skill.totalXp || 0,
          itemStyle: {
            color: skill.color
              ? {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: skill.color,
                    },
                    {
                      offset: 1,
                      color: `${skill.color}80`,
                    },
                  ],
                }
              : undefined,
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
