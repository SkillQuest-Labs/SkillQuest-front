import type { LevelProgression, XpThreshold } from "@/modules/stats/types/stats.types";

export const buildFormatterTooltip = (
  params: any[],
  levelProgressionData: LevelProgression[],
  filteredXpThresholds: XpThreshold[],
) => {
  if (!Array.isArray(params) || params.length === 0) return "";

  let tooltipContent = '<div style="display:flex;flex-direction:column;gap:0.7rem;">';
  let lastLevelInfo: { level: number; objectifAtteint: boolean } | null = null;

  params.forEach((param: any) => {
    if (param.value === null) return;

    if (param.seriesName === "Progression Niveau") {
      const progression = levelProgressionData[param.dataIndex];
      if (!progression) return;

      const threshold = filteredXpThresholds.find((t) => t.level === progression.level);
      const objectifAtteint = threshold ? progression.totalXpAtLevel >= threshold.xpCumulative : false;
      lastLevelInfo = { level: progression.level, objectifAtteint };

      tooltipContent += buildProgressionTooltipItem(progression);
    }

    if (param.seriesName === "Seuils XP") {
      const threshold = filteredXpThresholds[param.dataIndex];
      if (!threshold) return;

      const progression = levelProgressionData.find((p) => p.level === threshold.level);
      const objectifAtteint = progression ? progression.totalXpAtLevel >= threshold.xpCumulative : false;
      lastLevelInfo = { level: threshold.level, objectifAtteint };

      tooltipContent += buildThresholdTooltipItem(threshold);
    }
  });

  if (lastLevelInfo) {
    tooltipContent += buildTooltipObjectiveFooter(lastLevelInfo);
  }

  tooltipContent += "</div>";
  return tooltipContent;
};

// Items du tooltip
const buildProgressionTooltipItem = (progression: LevelProgression) => {
  return `
      <div style="
        padding: 0.7rem 1rem;
        border-radius: 10px;
        background: #0f172a;
        box-shadow: 0 1px 4px rgba(30,41,59,0.10);
        color: #f8fafc;">
        <div style="font-weight:700;color:#38bdf8;font-size:1.08rem;display:flex;align-items:center;gap:0.5rem;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#38bdf8;"></span>
          Niveau ${progression.level}
          ${progression.isCurrentLevel ? '<span style="margin-left:0.5rem;padding:2px 8px;border-radius:6px;background:#06b6d4;color:#fff;font-size:0.85em;font-weight:600;">Niveau Actuel</span>' : ""}
        </div>
        <div style="margin-top:0.3rem;color:#f1f5f9;font-size:0.98rem;">
          <span style="font-weight:600;">XP total :</span> <span style="color:#bae6fd">${progression.totalXpAtLevel}</span>
        </div>
        <div style="color:#f1f5f9;font-size:0.98rem;">
          <span style="font-weight:600;">XP gagané dans ce niveau :</span> <span style="color:#7dd3fc">${progression.xpInLevel}</span>
        </div>
      </div>
    `;
};

const buildThresholdTooltipItem = (threshold: XpThreshold) => {
  return `
      <div style="
        padding: 0.45rem 0.7rem;
        border-radius: 7px;
        background: #1e293b;
        box-shadow: 0 1px 3px rgba(244,63,94,0.07);
        color: #f8fafc;">
        <div style="font-weight:700;color:#f43f5e;font-size:0.95rem;display:flex;align-items:center;gap:0.35rem;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#f43f5e;"></span>
          Seuil Niveau ${threshold.level}
        </div>
        <div style="margin-top:0.18rem;color:#fca5a5;font-size:0.87rem;">
          <span style="font-weight:600;">XP requis :</span> <span style="color:#fca5a5">${threshold.xpRequired}</span>
        </div>
      </div>
    `;
};

const buildTooltipObjectiveFooter = (info: { level: number; objectifAtteint: boolean }) => {
  const { level, objectifAtteint } = info;
  return `
      <div style="margin-top:0.35rem;display:flex;align-items:center;justify-content:center;">
        <div style="
          display:inline-flex;
          align-items:center;
          gap:0.35rem;
          padding:0.32rem 0.9rem;
          border-radius:6px;
          background: ${objectifAtteint ? "linear-gradient(90deg,#22c55e 0%,#166534 100%)" : "linear-gradient(90deg,#f43f5e 0%,#991b1b 100%)"};
          color:#fff;
          font-size:0.92rem;
          font-weight:600;
          box-shadow:0 1.5px 6px rgba(0,0,0,0.09);
          min-width:140px;
          text-align:center;">
          Objectif XP du niveau ${level} <span style="font-weight:700;">${objectifAtteint ? "Atteint !" : "Non atteint"}</span>
        </div>
      </div>
    `;
};
