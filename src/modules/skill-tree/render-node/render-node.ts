import { LEVEL_COLORS, type SkillTreeNode, isCircularSkillNode, isHierarchicalSkillNode } from "../skill-tree.type";

const getLevelColors = (level: number) => {
  if (LEVEL_COLORS[level]) {
    return LEVEL_COLORS[level];
  }
  // Default color for undefined levels
  return LEVEL_COLORS[0];
};

export const getNodeColor = (node: SkillTreeNode, activeNodePath: string[], hoveredNode: string | null) => {
  if (node.isLocked) return "#1a202c"; // Dark slate for locked
  if (node.status === "COMPLETED") return "#34d399"; // Emerald-400 (completed stays green)
  if (activeNodePath.includes(node.id)) return "#22d3ee"; // Cyan-400 (active path)
  if (hoveredNode === node.id) return "#60a5fa"; // Blue-400

  // Get level based on node type
  const level = isCircularSkillNode(node) ? node.ring : isHierarchicalSkillNode(node) ? node.level : 0;
  const { node: levelNodeColor } = getLevelColors(level);
  return levelNodeColor; // Use level color
};

export const getNodeBorderColor = (node: SkillTreeNode, activeNodePath: string[], selectedNode: string | null) => {
  if (selectedNode === node.id) return "#fbbf24"; // Amber-400 (selected)
  if (node.isLocked) return "#dc2626"; // Red-600 for locked border
  if (activeNodePath.includes(node.id)) return "#67e8f9"; // Cyan-300
  if (node.status === "COMPLETED") return "#6ee7b7"; // Emerald-300

  // Get level based on node type
  const level = isCircularSkillNode(node) ? node.ring : isHierarchicalSkillNode(node) ? node.level : 0;
  const { border: levelBorderColor } = getLevelColors(level);
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
