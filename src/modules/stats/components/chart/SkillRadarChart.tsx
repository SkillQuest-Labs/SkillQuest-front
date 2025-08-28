import ReactECharts from "echarts-for-react";
import { Award, Target, TrendingUp } from "lucide-react";
import React from "react";
import type { ChartData } from "../../types/stats.types";

interface SkillRadarChartProps {
  data: ChartData;
  height?: number;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data, height = 400 }) => {
  const { skillRadarMetrics } = data;

  // Configuration du radar chart avec ECharts
  const getRadarOptions = () => {
    const indicators = skillRadarMetrics.map((skill) => ({
      name: skill.skillName,
      max: skill.maxLevel,
      color: skill.color,
    }));

    const radarData = skillRadarMetrics.map((skill) => skill.masteryLevel);

    // Série principale (le polygone visible)
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
          // on laisse showSymbol par défaut (sera masqué/recouvert par les séries "points")
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
      lineStyle: { opacity: 0 },
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
          // params est un objet ici (trigger=item)
          const p = Array.isArray(params) ? params[0] : params;
          // Cherche le skill par nom de série (on a mis name = skill.skillName)
          const skill = skillRadarMetrics.find((s) => s.skillName === p.seriesName);

          // Si on clique/hover sur la série principale (polygone), on peut fallback
          if (!skill) {
            // Exemple : on affiche le panneau générique
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
              <div style="margin-bottom: 2px;">
                <span style="color: #94a3b8;">Niveau max:</span>
                <span style="color: #f1f5f9; font-weight: 600; margin-left: 8px;">
                  ${skill.maxLevel}%
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
        radius: "70%",
        startAngle: 90,
        splitNumber: 5,
        shape: "polygon",
        indicator: indicators,
        name: {
          textStyle: { color: "#e2e8f0", fontSize: 13, fontWeight: 600 },
          formatter: (name: string) => (name.length > 12 ? name.substring(0, 12) + "..." : name),
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
            radar: { radius: "60%", name: { textStyle: { fontSize: 11 } } },
          },
        },
      ],
    };
  };

  // Calcul des statistiques récapitulatives
  const averageMastery = Math.round(
    skillRadarMetrics.reduce((sum, skill) => sum + skill.masteryLevel, 0) / skillRadarMetrics.length,
  );

  const topSkill = skillRadarMetrics.reduce((prev, current) =>
    prev.masteryLevel > current.masteryLevel ? prev : current,
  );

  const skillsAbove80 = skillRadarMetrics.filter((skill) => skill.masteryLevel >= 80).length;

  return (
    <div className="w-full bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Profil de Compétences
        </h3>
        <p className="text-gray-400 text-sm">Visualisation radar de votre niveau de maîtrise par compétence</p>
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        <ReactECharts
          option={getRadarOptions()}
          style={{ height: `${height}px`, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>

      {/* Statistiques récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Maîtrise Moyenne</p>
              <p className="text-white text-lg font-bold">{averageMastery}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Meilleure Compétence</p>
              <p className="text-white text-lg font-bold truncate" title={topSkill.skillName}>
                {topSkill.skillName.length > 12 ? topSkill.skillName.substring(0, 12) + "..." : topSkill.skillName}
              </p>
              <p className="text-green-400 text-sm">{topSkill.masteryLevel}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Skills Expertes</p>
              <p className="text-white text-lg font-bold">{skillsAbove80}</p>
              <p className="text-purple-400 text-sm">≥ 80% maîtrise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillRadarChart;
