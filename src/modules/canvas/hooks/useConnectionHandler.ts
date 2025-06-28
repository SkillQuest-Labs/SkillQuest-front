import { addEdge, MarkerType, type Connection, type Edge } from "@xyflow/react";
import { useCallback } from "react";

export const useConnectionHandler = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
) => {
  return useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `e${params.source}-${params.target}`,
        ...params,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#fde68a", strokeWidth: 3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#6366f1",
        },
      };

      setEdges((eds: Edge[]) => addEdge(newEdge, eds));
    },
    [setEdges],
  );
};
