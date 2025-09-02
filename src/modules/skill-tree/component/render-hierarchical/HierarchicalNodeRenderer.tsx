import { nodeBaseStyle } from "../../render-node/node-base-style";
import { getNodeBorderColor, getNodeColor } from "../../render-node/render-node";
import type { HierarchicalSkillNode } from "../../skill-tree.type";
import { nodeContent } from "../render-node-component/node-content";

type HierarchicalNodeRendererProps = {
  node: HierarchicalSkillNode;
  activeNodePath: string[];
  hoveredNode: string | null;
  selectedNode: string | null;
  highlightedPathNodes: string[];
  handleNodeClick: (e: React.MouseEvent<Element, MouseEvent>, nodeId: string) => void;
  setHoveredNode: (value: React.SetStateAction<string | null>) => void;
};

export const HierarchicalNodeRenderer = ({
  node,
  activeNodePath,
  hoveredNode,
  selectedNode,
  highlightedPathNodes,
  handleNodeClick,
  setHoveredNode,
}: HierarchicalNodeRendererProps) => {
  const color = getNodeColor(node, activeNodePath, hoveredNode);
  const borderColor = getNodeBorderColor(node, activeNodePath, selectedNode);
  const isActive = activeNodePath.includes(node.id);
  const isPathHighlighted = highlightedPathNodes.includes(node.id);

  const baseStyle = nodeBaseStyle({
    node,
    color,
    borderColor,
    isPathHighlighted,
    isActive,
    isSelected: selectedNode === node.id,
  });

  // Use square shape for hierarchical nodes
  const shapeStyle = {
    borderRadius: node.nodeType === "mastery" ? "50%" : "8px",
    width: `${node.size}px`,
    height: `${node.size}px`,
  };

  const content = nodeContent(node);

  return (
    <div
      key={node.id}
      data-node-id={node.id}
      style={{
        ...baseStyle,
        ...shapeStyle,
        position: "absolute",
        // Add subtle shadow for hierarchical nodes
        boxShadow: isPathHighlighted ? "0 4px 20px rgba(59, 130, 246, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
      }}
      onClick={(e) => handleNodeClick(e, node.id)}
      onMouseEnter={() => setHoveredNode(node.id)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      {content}

      {/* Level indicator for hierarchical layout */}
      {node.level > 0 && (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 16,
            height: 16,
            backgroundColor: "#6366f1",
            borderRadius: "50%",
            fontSize: "10px",
            fontWeight: "bold",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {node.level}
        </div>
      )}

      {/* Progress indicator for hierarchical nodes */}
      {node.status === "NOT_STARTED" && !node.isLocked && (
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: shapeStyle.borderRadius,
            border: "2px solid #3b82f6",
            opacity: 0.6,
            animation: "hierarchical-pulse 2s infinite",
          }}
        />
      )}

      <style>
        {`
          @keyframes hierarchical-pulse {
            0%, 100% { 
              transform: scale(1);
              opacity: 0.6;
            }
            50% { 
              transform: scale(1.05);
              opacity: 0.8;
            }
          }
        `}
      </style>
    </div>
  );
};
