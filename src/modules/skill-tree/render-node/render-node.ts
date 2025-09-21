import { LEVEL_COLORS, type CircularSkillNode } from "../skill-tree.type";

const STATUS_COLORS = {
  LOCKED: { fill: "#0f172a", border: "#475569" },
  NOT_STARTED: { fill: "#1e3a8a", border: "#60a5fa" },
  IN_PROGRESS: { fill: "#7c2d12", border: "#fbbf24" },
  COMPLETED: { fill: "#065f46", border: "#34d399" },
} as const;

const getLevelColors = (level: number) => {
  if (LEVEL_COLORS[level]) {
    return LEVEL_COLORS[level];
  }
  // Default color for undefined levels
  return LEVEL_COLORS[0];
};

export const getNodeColor = (node: CircularSkillNode, activeNodePath: string[], hoveredNode: string | null) => {
  if (node.status && node.status in STATUS_COLORS) {
    return STATUS_COLORS[node.status as keyof typeof STATUS_COLORS].fill;
  }
  if (node.isLocked) return STATUS_COLORS.LOCKED.fill;
  if (activeNodePath.includes(node.id)) return "#22d3ee"; // Cyan-400 (active path)
  if (hoveredNode === node.id) return "#60a5fa"; // Blue-400

  const { node: levelNodeColor } = getLevelColors(node.ring);
  return levelNodeColor; // Use level color
};

export const getNodeBorderColor = (node: CircularSkillNode, activeNodePath: string[], selectedNode: string | null) => {
  if (selectedNode === node.id) return "#fbbf24"; // Amber-400 (selected)
  if (node.status && node.status in STATUS_COLORS) {
    return STATUS_COLORS[node.status as keyof typeof STATUS_COLORS].border;
  }
  if (node.isLocked) return STATUS_COLORS.LOCKED.border;
  if (activeNodePath.includes(node.id)) return "#67e8f9"; // Cyan-300

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
