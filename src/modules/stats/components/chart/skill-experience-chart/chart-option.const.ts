import type { TimePeriod, XpTimeSeriesPoint } from "./type";

export const getLineChartOption = ({ data }: { data: XpTimeSeriesPoint[]; period?: TimePeriod }) => {
  return {
    backgroundColor: "transparent",
    animation: true,
    animationDuration: 800,
    animationEasing: "cubicOut",
    animationDelay: 0,
    animationDurationUpdate: 800,
    animationEasingUpdate: "cubicOut",
    animationDelayUpdate: 0,
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      top: "15%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(35, 41, 70, 0.95)",
      borderColor: "#fbbf24",
      borderWidth: 1,
      textStyle: {
        color: "#ffffff",
        fontSize: 12,
      },
      formatter: (params: any) => {
        if (Array.isArray(params) && params.length > 0) {
          const param = params[0];
          const item = param?.data ?? {};
          const label = item.tooltipLabel || param.name;
          const value = typeof param.value === "number" ? param.value : item.value;

          return `
            <div style="padding: 8px;">
              <div style="color: #fbbf24; font-weight: bold; margin-bottom: 4px;">${label}</div>
              <div style="color: #ffffff;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #fbbf24; border-radius: 50%; margin-right: 2px;"></span>
                ${Number(value || 0).toLocaleString("fr-FR")} XP gagné
              </div>
            </div>
          `;
        }
        return "";
      },
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.label),
      axisLine: {
        lineStyle: {
          color: "#374151",
        },
      },
      axisTick: {
        lineStyle: {
          color: "#374151",
        },
      },
      axisLabel: {
        color: "#9ca3af",
        fontSize: 11,
      },
    },
    yAxis: {
      type: "value",
      name: "XP",
      nameTextStyle: {
        color: "#9ca3af",
        fontSize: 12,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#9ca3af",
        fontSize: 11,
        formatter: (value: number) => {
          if (value >= 1000) {
            return (value / 1000).toFixed(0) + "k";
          }
          return value.toString();
        },
      },
      splitLine: {
        lineStyle: {
          color: "#374151",
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "XP",
        type: "line",
        data: data.map((item) => ({
          value: item.xp,
          tooltipLabel: item.tooltipLabel,
        })),
        smooth: true,
        lineStyle: {
          color: "#22d3ee",
          width: 3,
          shadowColor: "rgba(34, 211, 238, 0.3)",
          shadowBlur: 10,
          shadowOffsetY: 2,
        },
        itemStyle: {
          color: "#22d3ee",
          borderColor: "#ffffff",
          borderWidth: 2,
          shadowColor: "rgba(34, 211, 238, 0.5)",
          shadowBlur: 8,
        },
        symbol: "circle",
        symbolSize: 8,
        emphasis: {
          itemStyle: {
            color: "#22d3ee",
            borderColor: "#ffffff",
            borderWidth: 3,
            shadowColor: "rgba(34, 211, 238, 0.8)",
            shadowBlur: 15,
          },
          lineStyle: {
            width: 4,
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
                color: "rgba(34, 211, 238, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(34, 211, 238, 0.05)",
              },
            ],
          },
        },
        animation: true,
        animationDuration: 800,
        animationEasing: "cubicOut",
        animationDelay: (idx: number) => idx * 50,
        animationDurationUpdate: 800,
        animationEasingUpdate: "cubicOut",
        animationDelayUpdate: (idx: number) => idx * 30,
      },
    ],
  };
};
