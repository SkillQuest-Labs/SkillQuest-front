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
              <div style="
                padding: 16px 18px 14px 18px;
                min-width: 210px;
                background: linear-gradient(135deg, #232946 70%, #38bdf8 120%);
                border-radius: 14px;
                box-shadow: 0 4px 24px 0 rgba(56,189,248,0.10), 0 1.5px 0 #38bdf8 inset;
                border: 1px solid #38bdf8;
                position: relative;
                overflow: hidden;
                font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  margin-bottom: 10px;
                  gap: 8px;
                ">
                  <span style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 60% 40%, ${skill.color || "#38bdf8"} 70%, #232946 100%);
                    box-shadow: 0 0 8px 2px ${skill.color || "#38bdf8"}80;
                    border: 2px solid #fff3;
                  "></span>
                  <span style="
                    font-weight: 700;
                    color: #fff;
                    font-size: 1.13rem;
                    letter-spacing: 0.01em;
                    text-shadow: 0 2px 8px #232946cc;
                  ">
                    ${skill.title}
                  </span>
                  <span style="
                    margin-left: auto;
                    background: #232946cc;
                    color: #38bdf8;
                    font-size: 0.85rem;
                    font-weight: 600;
                    padding: 2px 10px;
                    border-radius: 8px;
                    letter-spacing: 0.03em;
                    box-shadow: 0 1px 4px #38bdf855;
                  ">
                    ${skill.difficulty && typeof skill.difficulty.toUpperCase === "function" ? skill.difficulty.toUpperCase() : "N/A"}
                  </span>
                </div>
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 5px;
                  margin-top: 2px;
                ">
                  <div style="
                    color: #38bdf8;
                    font-size: 1.01rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  ">
                    <svg width="18" height="18" style="vertical-align: middle;" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12V6a4 4 0 0 1 8 0v6"/><rect x="2" y="12" width="12" height="6" rx="3"/></svg>
                    XP Total&nbsp;: <span style="font-weight: 800; color: #fff;">${typeof skill.totalXp === "number" && skill.totalXp != null ? skill.totalXp.toLocaleString("fr-FR") : 0}</span>
                  </div>
                  <div style="
                    color: #22c55e;
                    font-size: 1.01rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  ">
                    <svg width="18" height="18" style="vertical-align: middle;" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M5.5 17a7 7 0 0 1 7 0"/></svg>
                    Quêtes complètés&nbsp;: <span style="font-weight: 800; color: #fff;">${typeof skill.completedQuests === "number" ? skill.completedQuests : 0}</span>
                  </div>
                  <div style="
                    color: #a5b4fc;
                    font-size: 1.01rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  ">
                    <svg width="18" height="18" style="vertical-align: middle;" fill="none" stroke="#a5b4fc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="12" height="6" rx="3"/><path d="M9 11V7"/></svg>
                    XP Moyen&nbsp;: <span style="font-weight: 800; color: #fff;">${typeof skill.averageQuestXp === "number" && skill.averageQuestXp != null ? skill.averageQuestXp.toLocaleString("fr-FR") : 0}</span>
                  </div>
                </div>
                <div style="
                  position: absolute;
                  right: -18px;
                  bottom: -18px;
                  width: 60px;
                  height: 60px;
                  background: radial-gradient(circle at 40% 40%, #38bdf8 0%, #232946 80%);
                  opacity: 0.13;
                  border-radius: 50%;
                  pointer-events: none;
                "></div>
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
        barWidth: "30%",
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
