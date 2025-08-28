import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import type { ChartData } from "../../types/stats.types";

type SkillExperienceChartProps = {
  data: ChartData;
  height?: number;
};

export const SkillExperienceChart = ({ data, height = 400 }: SkillExperienceChartProps) => {
  const chartOptions = useMemo(() => {
    const { experienceMetrics } = data;

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
      },
      legend: {
        data: ["XP par Skill"],
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
        data: experienceMetrics.map((metric) => metric.skillName),
        axisLabel: {
          color: "#cbd5e1",
          fontSize: 13,
          fontWeight: 500,
          rotate: 35,
          margin: 13,
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
        name: "XP Total",
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
    };
  }, [data]);

  return (
    <div className="w-full rounded-xl bg-[#131928] p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">XP par Compétence</h3>
        <p className="text-sm text-gray-400">Visualisation de votre expérience accumulée par compétence</p>
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
          <div className="font-semibold text-white">{data.userStats.totalXp.toLocaleString()}</div>
          <div className="text-gray-400">XP Total</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.userStats.skillsCompleted}</div>
          <div className="text-gray-400">Skills Complétées</div>
        </div>
        <div className="bg-[#1e293b] rounded-lg p-3 text-center">
          <div className="font-semibold text-white">{data.experienceMetrics.length}</div>
          <div className="text-gray-400">Skills Actives</div>
        </div>
      </div>
    </div>
  );
};
