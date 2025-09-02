import { nodeBaseStyle } from "../../render-node/node-base-style";
import { nodeShapeStyle } from "../../render-node/node-shape-style";
import { getNodeBorderColor, getNodeColor } from "../../render-node/render-node";
import type { SkillTreeNode, CircularSkillNode } from "../../skill-tree.type";
import { isHierarchicalSkillNode } from "../../skill-tree.type";
import { nodeContent } from "./node-content";
import { HierarchicalNodeRenderer } from "../render-hierarchical/HierarchicalNodeRenderer";

type NodeRendererProps = {
  node: SkillTreeNode;
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
  // Use hierarchical renderer for hierarchical nodes
  if (isHierarchicalSkillNode(node)) {
    return (
      <HierarchicalNodeRenderer
        node={node}
        activeNodePath={activeNodePath}
        hoveredNode={hoveredNode}
        selectedNode={selectedNode}
        highlightedPathNodes={highlightedPathNodes}
        handleNodeClick={handleNodeClick}
        setHoveredNode={setHoveredNode}
      />
    );
  }

  // Default to circular renderer for circular nodes
  const circularNode = node as CircularSkillNode;
  const color = getNodeColor(circularNode, activeNodePath, hoveredNode);
  const borderColor = getNodeBorderColor(circularNode, activeNodePath, selectedNode);
  const isActive = activeNodePath.includes(circularNode.id);
  const isPathHighlighted = highlightedPathNodes.includes(circularNode.id);

  const baseStyle = nodeBaseStyle({
    node: circularNode,
    color,
    borderColor,
    isPathHighlighted,
    isActive,
    isSelected: selectedNode === circularNode.id,
  });

  const shapeStyle = nodeShapeStyle(circularNode.shape);

  const content = nodeContent(circularNode);

  return (
    <div
      key={circularNode.id}
      data-node-id={circularNode.id}
      style={{ ...baseStyle, ...shapeStyle, position: "absolute" }}
      onClick={(e) => handleNodeClick(e, circularNode.id)}
      onMouseEnter={() => setHoveredNode(circularNode.id)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      {content}

      {/* Pulsing effect for available quest */}
      {circularNode.status === "NOT_STARTED" && (
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
