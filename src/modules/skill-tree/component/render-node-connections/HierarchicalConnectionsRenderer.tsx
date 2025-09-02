import type { HierarchicalSkillNode } from "../../skill-tree.type";

type HierarchicalConnectionsRendererProps = {
  nodes: HierarchicalSkillNode[];
  hoveredNode: string | null;
  activeNodePath: string[];
  highlightedPathNodes: string[];
};

export const HierarchicalConnectionsRenderer = ({
  nodes,
  hoveredNode,
  activeNodePath,
  highlightedPathNodes,
}: HierarchicalConnectionsRendererProps) => {
  const connections: Array<{
    from: HierarchicalSkillNode;
    to: HierarchicalSkillNode;
    isHighlighted: boolean;
    isActive: boolean;
  }> = [];

  // Build connections array
  nodes.forEach((node) => {
    node.connections.forEach((connectionId) => {
      const targetNode = nodes.find((n) => n.id === connectionId);
      if (targetNode) {
        const isHighlighted = highlightedPathNodes.includes(node.id) || highlightedPathNodes.includes(targetNode.id);
        const isActive = activeNodePath.includes(node.id) || activeNodePath.includes(targetNode.id);

        connections.push({
          from: node,
          to: targetNode,
          isHighlighted,
          isActive,
        });
      }
    });
  });

  return (
    <svg className="absolute inset-0 pointer-events-none z-0" style={{ overflow: "visible" }}>
      <defs>
        <marker
          id="hierarchical-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="3"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#6366f1" />
        </marker>
        <marker
          id="hierarchical-arrow-highlighted"
          viewBox="0 0 10 10"
          refX="9"
          refY="3"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" />
        </marker>
      </defs>

      {connections.map(({ from, to, isHighlighted, isActive }, index) => {
        const strokeColor = isHighlighted
          ? "#fbbf24" // amber-400
          : isActive
            ? "#60a5fa" // blue-400
            : "#6366f1"; // indigo-500

        const strokeWidth = isHighlighted ? 3 : isActive ? 2 : 1.5;
        const opacity = hoveredNode && !isHighlighted && hoveredNode !== from.id && hoveredNode !== to.id ? 0.3 : 1;

        // Calculate connection points
        const fromX = from.position.x + from.size / 2;
        const fromY = from.position.y + from.size;
        const toX = to.position.x + to.size / 2;
        const toY = to.position.y;

        // Create a smooth curved path for hierarchical connections
        const midY = fromY + (toY - fromY) / 2;
        const pathData = `M ${fromX} ${fromY} Q ${fromX} ${midY} ${toX} ${toY}`;

        return (
          <g key={`${from.id}-${to.id}-${index}`}>
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={opacity}
              markerEnd={`url(#${isHighlighted ? "hierarchical-arrow-highlighted" : "hierarchical-arrow"})`}
              className="transition-all duration-300"
            />

            {/* Connection glow effect for highlighted paths */}
            {isHighlighted && (
              <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth + 2}
                opacity={0.3}
                className="animate-pulse"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
