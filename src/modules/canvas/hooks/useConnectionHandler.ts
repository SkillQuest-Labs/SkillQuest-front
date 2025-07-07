import { addEdge, MarkerType, type Connection, type Edge } from "@xyflow/react";
import { useCallback } from "react";

export const useConnectionHandler = (edges: Edge[], setEdges: (edges: Edge[]) => void) => {
  return useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `e${params.source}-${params.target}`,
        ...params,
        type: "custom",
        animated: true,
        style: { stroke: "#fde68a", strokeWidth: 3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6366f1",
        },
      };

      const updated = addEdge(newEdge, edges);
      setEdges(updated);
    },
    [edges, setEdges],
  );
};
