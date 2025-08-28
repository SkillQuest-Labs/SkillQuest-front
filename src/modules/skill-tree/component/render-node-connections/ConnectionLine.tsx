import { getConnectionColor } from "../../render-node/render-node";
import type { CircularSkillNode } from "../../skill-tree.type";

type ConnectionLineProps = {
  node: CircularSkillNode;
  prereqNode: CircularSkillNode;
  hoveredNode: string | null;
  activeNodePath: string[];
  highlightedPathNodes: string[];
};

export const ConnectionLine = ({
  node,
  prereqNode,
  hoveredNode,
  activeNodePath,
  highlightedPathNodes,
}: ConnectionLineProps) => {
  const isHovered = hoveredNode === node.id || hoveredNode === prereqNode.id;
  const isTargetLocked = node.isLocked; // Check if the target node is locked
  const strokeColor = getConnectionColor(prereqNode, node, activeNodePath, highlightedPathNodes);

  const isPathHighlighted = highlightedPathNodes.includes(prereqNode.id) && highlightedPathNodes.includes(node.id);
  const isActiveConnection = activeNodePath.includes(prereqNode.id) && activeNodePath.includes(node.id);

  return (
    <g>
      {/* Glow effect for highlighted path connections */}
      {isPathHighlighted && (
        <line
          x1={prereqNode.position.x}
          y1={prereqNode.position.y}
          x2={node.position.x}
          y2={node.position.y}
          stroke="url(#pathHighlightConnection)"
          strokeWidth="8"
          strokeOpacity="0.6"
          filter="blur(3px)"
        />
      )}

      {/* Active/hovered glow (if not highlighted) */}
      {(isActiveConnection || isHovered) && !isTargetLocked && !isPathHighlighted && (
        <line
          x1={prereqNode.position.x}
          y1={prereqNode.position.y}
          x2={node.position.x}
          y2={node.position.y}
          stroke="url(#activeConnection)"
          strokeWidth="6"
          strokeOpacity="0.4"
          filter="blur(2px)"
        />
      )}

      {/* Main connection line */}
      <line
        x1={prereqNode.position.x}
        y1={prereqNode.position.y}
        x2={node.position.x}
        y2={node.position.y}
        stroke={strokeColor}
        strokeWidth={isPathHighlighted ? 4 : isActiveConnection ? 3 : 1.5} // Slightly thicker for non-active branch connections
        strokeOpacity={isPathHighlighted ? 1 : isActiveConnection ? 1 : isTargetLocked ? 0.5 : 0.8} // Inactive connections are less opaque
        strokeDasharray={isTargetLocked ? "5,5" : "none"} // Dashed for locked paths
      />
    </g>
  );
};
