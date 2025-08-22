import type { CircularSkillNode } from "../skill-tree.type";

export const LEVEL_COLORS: Record<number, { node: string; border: string; connection: string }> = {
  0: { node: "#312e81", border: "#818cf8", connection: "#4f46e5" }, // Indigo - Centre
  1: { node: "#065f46", border: "#34d399", connection: "#10b981" }, // Emerald - Niveau 1
  2: { node: "#1d4ed8", border: "#60a5fa", connection: "#3b82f6" }, // Blue - Niveau 2
  3: { node: "#9a3412", border: "#fb923c", connection: "#f97316" }, // Orange - Niveau 3
  4: { node: "#581c87", border: "#c084fc", connection: "#a855f7" }, // Purple - Niveau 4
  5: { node: "#854d0e", border: "#facc15", connection: "#eab308" }, // Amber - Niveau 5
  6: { node: "#be123c", border: "#f87171", connection: "#ef4444" }, // Red - Niveau 6
  7: { node: "#166534", border: "#4ade80", connection: "#22c55e" }, // Green - Niveau 7
  8: { node: "#7c2d12", border: "#fdba74", connection: "#fb923c" }, // Orange-800 - Niveau 8
};

const getLevelColors = (level: number) => {
  if (LEVEL_COLORS[level]) {
    return LEVEL_COLORS[level];
  }
  // Default color for undefined levels
  return LEVEL_COLORS[0];
};

export const getNodeColor = (node: CircularSkillNode, activeNodePath: string[], hoveredNode: string | null) => {
  if (node.isLocked) return "#1a202c"; // Dark slate for locked
  if (node.status === "COMPLETED") return "#34d399"; // Emerald-400 (completed stays green)
  if (activeNodePath.includes(node.id)) return "#22d3ee"; // Cyan-400 (active path)
  if (hoveredNode === node.id) return "#60a5fa"; // Blue-400

  const { node: levelNodeColor } = getLevelColors(node.ring);
  return levelNodeColor; // Use level color
};

export const getNodeBorderColor = (node: CircularSkillNode, activeNodePath: string[], selectedNode: string | null) => {
  if (selectedNode === node.id) return "#fbbf24"; // Amber-400 (selected)
  if (node.isLocked) return "#dc2626"; // Red-600 for locked border
  if (activeNodePath.includes(node.id)) return "#67e8f9"; // Cyan-300
  if (node.status === "COMPLETED") return "#6ee7b7"; // Emerald-300

  const { border: levelBorderColor } = getLevelColors(node.ring);
  return levelBorderColor; // Use level border color
};

export const getConnectionColor = (
  fromNode: CircularSkillNode,
  toNode: CircularSkillNode,
  activeNodePath: string[],
  highlightedPathNodes: string[],
) => {
  const isActiveConnection = activeNodePath.includes(fromNode.id) && activeNodePath.includes(toNode.id);
  const isPathHighlighted = highlightedPathNodes.includes(fromNode.id) && highlightedPathNodes.includes(toNode.id);

  if (isPathHighlighted) return "url(#pathHighlightConnection)";
  if (isActiveConnection) return "url(#activeConnection)";

  const { connection: levelConnectionColor } = getLevelColors(toNode.ring);
  return `url(#levelConnection-${levelConnectionColor.substring(1)})`; // Create unique gradient ID
};
