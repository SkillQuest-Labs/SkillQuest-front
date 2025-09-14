import type { SkillRadarData } from "@/modules/stats/types/stats.types";

export const getChartOptions = (skillRadarMetrics: SkillRadarData[]) => {
  const radarChartOptions = () => {
    // ensure there are at least 3 axes to form a polygon
    let indicators, radarData;
    const minAxes = 3;

    if (skillRadarMetrics.length < minAxes) {
      // Cas avec moins de 3 skills : on ajoute des axes fictifs
      indicators = [];
      radarData = [];

      // Ajouter les vrais skills
      skillRadarMetrics.forEach((skill) => {
        indicators.push({
          name: skill.skillName,
          color: "#FFF",
          max: 100,
        });
        radarData.push(skill.masteryLevel);
      });

      // Ajouter des axes fictifs invisibles pour atteindre le minimum
      const axesToAdd = minAxes - skillRadarMetrics.length;
      for (let i = 0; i < axesToAdd; i++) {
        indicators.push({
          name: "", // Axe fictif invisible
          color: "transparent",
          max: 100,
        });
        radarData.push(0); // Valeur 0 pour les axes fictifs
      }
    } else {
      // Cas normal : 3+ skills
      indicators = skillRadarMetrics.map((skill) => ({
        name: skill.skillName,
        color: "#FFF",
        max: 100,
      }));
      radarData = skillRadarMetrics.map((skill) => skill.masteryLevel);
    }

    // Main series (the visible polygon)
    const mainSeries = {
      name: "Profil de Compétences",
      type: "radar",
      data: [
        {
          value: radarData,
          name: "Niveau de Maîtrise",
          itemStyle: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: "rgba(255, 255, 255, 1)" },
                { offset: 0.7, color: "rgba(59, 130, 246, 1)" },
                { offset: 1, color: "rgba(139, 92, 246, 0.8)" },
              ],
            },
            borderColor: "rgba(255, 255, 255, 0.8)",
            borderWidth: 2,
            shadowColor: "rgba(59, 130, 246, 0.8)",
            shadowBlur: 15,
          },
          lineStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(59, 130, 246, 1)" },
                { offset: 0.5, color: "rgba(139, 92, 246, 0.9)" },
                { offset: 1, color: "rgba(236, 72, 153, 0.8)" },
              ],
            },
            width: 4,
            shadowColor: "rgba(59, 130, 246, 0.6)",
            shadowBlur: 10,
            cap: "round",
            join: "round",
          },
          areaStyle: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                { offset: 0, color: "rgba(59, 130, 246, 0.6)" },
                { offset: 0.3, color: "rgba(139, 92, 246, 0.4)" },
                { offset: 0.7, color: "rgba(236, 72, 153, 0.3)" },
                { offset: 1, color: "rgba(59, 130, 246, 0.1)" },
              ],
            },
            shadowColor: "rgba(59, 130, 246, 0.4)",
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
          symbol: "circle",
          symbolSize: 12,
        },
      ],
      emphasis: {
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.8 },
      },
    };

    // Séries "point" : une par skill, elles n'ont que 1 valeur non-nullule à la dimension correspondante
    const pointSeries = skillRadarMetrics.map((skill, idx) => ({
      name: skill.skillName,
      type: "radar",

      data: [
        {
          value: indicators.map((_, j) => {
            // Seul l'axe correspondant au skill a une valeur, les autres sont null
            return j === idx ? skill.masteryLevel : null;
          }),
        },
      ],

      lineStyle: { opacity: 0.5 },
      areaStyle: { opacity: 0 },
      symbol: "circle",
      symbolSize: 10,
      showSymbol: true,
      itemStyle: {
        color: {
          type: "radial",
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            { offset: 0, color: "rgba(255, 255, 255, 1)" },
            { offset: 0.4, color: "rgba(59, 130, 246, 0.9)" },
            { offset: 0.8, color: "rgba(139, 92, 246, 0.7)" },
            { offset: 1, color: "rgba(236, 72, 153, 0.5)" },
          ],
        },
        borderColor: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(255, 255, 255, 1)" },
            { offset: 1, color: "rgba(59, 130, 246, 0.8)" },
          ],
        },
        borderWidth: 3,
        shadowColor: "rgba(59, 130, 246, 0.6)",
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      emphasis: {
        symbolSize: 14,
      },
      // Ces séries doivent être dessinées **après** la série principale (pour être au-dessus)
      z: 10 + idx,
    }));

    return {
      renderer: "svg",
      animation: true,
      animationDuration: 2000,
      animationEasing: "elasticOut",
      animationDelay: (idx: number) => idx * 150 + 800,
      animationDurationUpdate: 800,
      animationEasingUpdate: "cubicInOut",

      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
        textStyle: { color: "#f1f5f9", fontSize: 13, fontWeight: 500 },
        confine: true,
        formatter: (params: any) => {
          const p = Array.isArray(params) ? params[0] : params;
          const skill = skillRadarMetrics.find((s) => s.skillName === p.seriesName);
          if (!skill) {
            return `
                  <div style="padding:8px;">
                    <div style="color:#f1f5f9; font-weight:600; margin-bottom:4px;">${p.seriesName || "Profil de Compétences"}</div>
                    <div style="color:#94a3b8;">Survolez un point pour voir les détails</div>
                  </div>
                `;
          }

          return `
                <div style="padding: 8px;">
                  <div style="color: ${skill.color}; font-weight: 600; margin-bottom: 4px;">
                    ${skill.skillName}
                  </div>
                  <div style="margin-bottom: 2px;">
                    <span style="color: #94a3b8;">Niveau de maîtrise:</span>
                    <span style="color: #f1f5f9; font-weight: 600; margin-left: 8px;">
                      ${skill.masteryLevel}%
                    </span>
                  </div>
                  ${
                    skill.description
                      ? `<div style="margin-top: 6px; color: #cbd5e1; font-size: 12px;">${skill.description}</div>`
                      : ""
                  }
                </div>
              `;
        },
      },

      legend: { show: false },

      radar: {
        center: ["50%", "50%"],
        radius: skillRadarMetrics.length > 6 ? "65%" : "70%",
        startAngle: 90,
        splitNumber: 5,
        shape: "polygon",
        indicator: indicators,
        name: {
          textStyle: {
            color: "#e2e8f0",
            fontSize: skillRadarMetrics.length > 8 ? 11 : skillRadarMetrics.length > 6 ? 12 : 13,
            fontWeight: 600,
          },
          formatter: (name: string) => {
            // Hide dummy axes in the case of a single skill
            if (name === "") return "";
            const maxLength = skillRadarMetrics.length > 8 ? 15 : skillRadarMetrics.length > 6 ? 18 : 20;
            return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
          },
        },
        splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.2)", width: 1 } },
        splitArea: { show: true, areaStyle: { color: ["rgba(59, 130, 246, 0.05)", "rgba(59, 130, 246, 0.02)"] } },
        axisLine: { lineStyle: { color: "rgba(148, 163, 184, 0.3)", width: 1 } },
      },

      series: [mainSeries, ...pointSeries],

      media: [
        {
          query: { maxWidth: 768 },
          option: {
            radar: {
              radius: skillRadarMetrics.length > 6 ? "55%" : "60%",
              name: {
                textStyle: {
                  fontSize: skillRadarMetrics.length > 8 ? 9 : skillRadarMetrics.length > 6 ? 10 : 11,
                },
                formatter: (name: string) => {
                  const maxLength = skillRadarMetrics.length > 8 ? 10 : skillRadarMetrics.length > 6 ? 12 : 15;
                  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
                },
              },
            },
          },
        },
      ],
    };
  };

  return radarChartOptions;
};
