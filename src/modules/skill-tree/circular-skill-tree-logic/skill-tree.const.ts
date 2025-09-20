import { isQuestNode } from "@/modules/canvas/canvas.const";
import type { CalculateNodePositionsProps, CountNodesPerLevel, SortNodesPerLevel } from "../skill-tree.type";

export const countNodesPerLevel = ({ nodes, visitedLevels }: CountNodesPerLevel) => {
  const nodesPerLevel: Record<number, number> = {};

  nodes.filter(isQuestNode).forEach((node) => {
    const level = visitedLevels[node.id] || 1;
    nodesPerLevel[level] = (nodesPerLevel[level] || 0) + 1;
  });

  return nodesPerLevel;
};

export const sortQuestNodesByLevel = ({ nodes, visitedLevels }: SortNodesPerLevel) => {
  return nodes.filter(isQuestNode).sort((a, b) => {
    const levelA = visitedLevels[a.id] || 1;
    const levelB = visitedLevels[b.id] || 1;
    if (levelA !== levelB) {
      return levelA - levelB;
    }

    return a.id.localeCompare(b.id);
  });
};

export const calculateNodePosition = ({ centerX, centerY, radius, angle }: CalculateNodePositionsProps) => ({
  x: centerX + Math.cos(angle) * radius,
  y: centerY + Math.sin(angle) * radius,
});
