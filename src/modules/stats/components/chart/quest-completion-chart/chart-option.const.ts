import type { QuestCompletionMetric } from "@/modules/stats/types/stats.types";

type chartOptionsParams = {
  questCompletionMetrics: QuestCompletionMetric[];
  isGrouped: boolean;
};

export const getChartOptions = ({ questCompletionMetrics, isGrouped }: chartOptionsParams) => {
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
};
