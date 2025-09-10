import { baseBarChartOptions } from "@/shared/utils/base-bar-chart-options.const";
import type { LevelProgression } from "@/modules/stats/types/stats.types";
import { buildFormatterTooltip } from "./toolip-formatter.const";
import { generateXpThresholds } from "@/modules/stats/stats.const";

export type ChartOptionsProps = {
  levelProgressionData: LevelProgression[];
  maxLevel?: number;
};

export const getChartOptions = ({ levelProgressionData, maxLevel = 10 }: ChartOptionsProps) => {
  if (levelProgressionData.length === 0 || maxLevel <= 0) return;
  const xpThresholds = generateXpThresholds(maxLevel);

  const minLevelsToShowForThresholds = Math.max(maxLevel, levelProgressionData.length);
  const maxLevelToShowForThresholds = Math.min(minLevelsToShowForThresholds, xpThresholds.length);
  const filteredXpThresholds = xpThresholds.slice(0, maxLevelToShowForThresholds);

  // The X axis must display all necessary levels (at least up to the thresholds)
  const maxLevelForAxis = Math.max(levelProgressionData.length, maxLevelToShowForThresholds);
  const axisLabels = Array.from({ length: maxLevelForAxis }, (_, i) => `Niv ${i + 1}`);

  const chartOptions = baseBarChartOptions({
    legendData: ["Progression Niveau", "Seuils XP"],
    tooltipFormatter: (params: any) => buildFormatterTooltip(params, levelProgressionData, filteredXpThresholds),
    xAxisData: axisLabels,
    yAxisName: "XP Cumulé",
    series: [
      {
        name: "Progression Niveau",
        type: "line",
        data: Array.from({ length: maxLevelForAxis }, (_, i) => {
          const prog = levelProgressionData[i];
          return prog ? prog.totalXpAtLevel : null;
        }),
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
        data: Array.from({ length: maxLevelForAxis }, (_, i) => {
          const threshold = filteredXpThresholds[i];
          return threshold ? threshold.xpCumulative : null;
          // if (threshold) {
          //   // Décaler la courbe vers le haut de 10% de la valeur maximale des seuils
          //   const maxThreshold = Math.max(...filteredXpThresholds.map(t => t.xpCumulative));
          //   const offset = maxThreshold * 0.1;
          //   return threshold.xpCumulative + offset;
          // }
          // return null;
        }),
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
  });
  return chartOptions;
};
