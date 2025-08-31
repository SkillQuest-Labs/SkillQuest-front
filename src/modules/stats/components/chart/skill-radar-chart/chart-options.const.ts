import type { SkillRadarData } from "@/modules/stats/types/stats.types";

export const getChartOptions = (skillRadarMetrics: SkillRadarData[]) => {
  const radarChartOptions = () => {
    const indicators = skillRadarMetrics.map((skill) => ({
      name: skill.skillName,
      color: skill.color,
      max: 100,
    }));

    const radarData = skillRadarMetrics.map((skill) => skill.masteryLevel);

    // Main series (the visible polygon)
    const mainSeries = {
      name: "Profil de Compétences",
      type: "radar",
      data: [
        {
          value: radarData,
          name: "Niveau de Maîtrise",
          itemStyle: { color: "rgba(59, 130, 246, 0.8)" },
          lineStyle: { color: "#3b82f6", width: 2 },
          areaStyle: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: "rgba(59, 130, 246, 0.4)" },
                { offset: 1, color: "rgba(59, 130, 246, 0.1)" },
              ],
            },
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
      name: skill.skillName, // utile pour retrouver le skill dans le tooltip
      type: "radar",
      // data : tableau d'une seule entrée où seules les autres dimensions sont null
      data: [
        {
          value: indicators.map((_, j) => (j === idx ? skill.masteryLevel : null)),
        },
      ],
      // On n'affiche pas le contour/aire pour ces mini-séries, seulement le symbole
      lineStyle: { opacity: 0.5 },
      areaStyle: { opacity: 0 },
      symbol: "circle",
      symbolSize: 10,
      showSymbol: true,
      itemStyle: { color: skill.color },
      emphasis: {
        symbolSize: 14,
      },
      // Ces séries doivent être dessinées **après** la série principale (pour être au-dessus)
      z: 10 + idx,
    }));

    return {
      renderer: "svg",
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut",

      tooltip: {
        trigger: "item", // on veut l'item pour permettre un tooltip par point (chaque point = une série)
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
