import type { CircularSkillNode } from "../../skill-tree.type";
import { nodeBaseStyle } from "./node-base-style";
import { nodeShapeStyle } from "./node-shape-style";
import { nodeContent } from "./node-style.const";
import { getNodeBorderColor, getNodeColor } from "./render-node";

type NodeRendererProps = {
  node: CircularSkillNode;
  activeNodePath: string[];
  hoveredNode: string | null;
  selectedNode: string | null;
  highlightedPathNodes: string[];
  handleNodeClick: (e: React.MouseEvent<Element, MouseEvent>, nodeId: string) => void;
  setHoveredNode: (value: React.SetStateAction<string | null>) => void;
};
export const NodeRenderer = ({
  node,
  activeNodePath,
  hoveredNode,
  selectedNode,
  highlightedPathNodes,
  handleNodeClick,
  setHoveredNode,
}: NodeRendererProps) => {
  const color = getNodeColor(node, activeNodePath, hoveredNode);
  const borderColor = getNodeBorderColor(node, activeNodePath, selectedNode);
  const isActive = activeNodePath.includes(node.id);
  const isPathHighlighted = highlightedPathNodes.includes(node.id); // Check if node is part of highlighted path

  const baseStyle = nodeBaseStyle({
    node,
    color,
    borderColor,
    isPathHighlighted,
    isActive,
    isSelected: selectedNode === node.id,
  });

  const shapeStyle = nodeShapeStyle(node.shape);

  const content = nodeContent(node);

  return (
    <div
      key={node.id}
      style={{ ...baseStyle, ...shapeStyle, position: "absolute" }}
      onClick={(e) => handleNodeClick(e, node.id)}
      onMouseEnter={() => setHoveredNode(node.id)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      {content}

      {/* Pulsing effect for available quest */}
      {node.status === "NOT_STARTED" && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            // backgroundColor: "#3b82f6",
            opacity: 0.3,
            borderRadius: shapeStyle.borderRadius || "50%",
            animation: "pulse 2s infinite",
          }}
        />
      )}
    </div>
  );
};
