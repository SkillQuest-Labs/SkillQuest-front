import type { SeriesOption } from "echarts";
import type { EChartsOption } from "echarts-for-react";

type baseBarChartOptionsParams = {
  gridOverrides?: EChartsOption["grid"];
  legendData: string[];
  tooltipFormatter: (params: any) => string;
  xAxisData: string[];
  yAxisName: string;
  series: SeriesOption[];
};

export const baseBarChartOptions = ({
  gridOverrides,
  legendData,
  tooltipFormatter,
  xAxisData,
  yAxisName,
  series,
}: baseBarChartOptionsParams) => {
  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 600,
    animationEasing: "cubicOut",
    grid: {
      left: "8%",
      right: "5%",
      top: "15%",
      bottom: "12%",
      containLabel: true,
      ...gridOverrides,
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
      formatter: tooltipFormatter,
    },
    legend: {
      data: legendData,
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
      data: xAxisData,
      axisLabel: {
        color: "#cbd5e1",
        fontSize: 13,
        fontWeight: 500,
        rotate: 35,
        margin: 13,
      },
      axisLine: { lineStyle: { color: "#334155", width: 2 } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: yAxisName,
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
        formatter: (value: number) => (value >= 1000 ? (value / 1000).toFixed(1) + "k" : value.toString()),
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          color: "#334155",
          type: "solid",
          width: 1,
          opacity: 0.6,
        },
      },
    },
    series,
  };
};
