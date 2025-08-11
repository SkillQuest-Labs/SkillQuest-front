import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { addEdge, MarkerType, type Connection, type Edge } from "@xyflow/react";
import { useCallback } from "react";

export const useConnectionHandler = (edges: Edge[], setEdges: (edges: Edge[]) => void) => {
  const markNewEdge = useCanvasStore((state) => state.markNewEdge);

  return useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `edge_${params.source}_${params.target}`,
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
      markNewEdge(newEdge.id);
    },
    [edges, setEdges, markNewEdge],
  );
};
