import type { CircularSkillNode } from "../../skill-tree.type";
import { ConnectionDefs } from "./ConnectionDefs";
import { ConnectionLine } from "./ConnectionLine";

type ConnectionsRendererProps = {
  nodes: CircularSkillNode[];
  hoveredNode: string | null;
  activeNodePath: string[];
  highlightedPathNodes: string[];
};

export const ConnectionsRenderer = ({
  nodes,
  hoveredNode,
  activeNodePath,
  highlightedPathNodes,
}: ConnectionsRendererProps) => {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <ConnectionDefs />

      {nodes.flatMap((node) =>
        node.prerequisites.map((prereqId) => {
          const prereqNode = nodes.find((n) => n.id === prereqId);
          if (!prereqNode) return null;

          return (
            <ConnectionLine
              key={`${node.id}-${prereqId}`}
              node={node}
              prereqNode={prereqNode}
              hoveredNode={hoveredNode}
              activeNodePath={activeNodePath}
              highlightedPathNodes={highlightedPathNodes}
            />
          );
        }),
      )}
    </svg>
  );
};
