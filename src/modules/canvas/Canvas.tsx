import { useCallback, useState } from "react";
import type { ViewModeType } from "./canvas.type";
import { useReactFlow, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./../../styles/canvas.css";
import { useCanvasGraph } from "./hooks/useCanvasGraph";
import { usePaneInteraction } from "./hooks/usePaneInteraction";
import { useConnectionHandler } from "./hooks/useConnectionHandler";
import { CanvasView } from "./components/CanvasView";
import { useSaveCanvas, useQuestsLoader } from "./hooks/useSaveCanvas";
import { Toaster } from "@/shared/components/ui/sonner";
import { useAutoSaveCanvas } from "./hooks/useAutoSaveCanvas";
import { useCanvasStore } from "@/stores/quest/canvas-store";

export const Canvas = () => {
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [, setViewMode] = useState<ViewModeType>("canvas");

  const { cursorMode, setCursorMode } = useCanvasStore();
  const { screenToFlowPosition } = useReactFlow();

  useQuestsLoader("uuid-skill-1234-5678-9012-345678901234"); // replace with actual skill ID

  const {
    nodes,
    // setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    addQuestNode,
    collapseAll,
    expandAll,
  } = useCanvasGraph(); // This hook can be used to manage nodes and edges if needed

  const onConnect = useConnectionHandler(edges, setEdges);
  const onPaneClick = usePaneInteraction({
    mode: cursorMode,
    addQuestNode,
    screenToFlowPosition,
  });

  const { saveCanvas } = useSaveCanvas();
  useAutoSaveCanvas(nodes, saveCanvas, 2500);

  // - If no start point is selected, stores the clicked node's id.
  // - Otherwise, connects the start node to the clicked node and resets the selection.
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (cursorMode !== "connect") return;
      event.stopPropagation();

      if (!connectionStart) {
        setConnectionStart(node.id);
      } else if (connectionStart !== node.id) {
        onConnect({
          source: connectionStart,
          target: node.id,
          sourceHandle: null,
          targetHandle: null,
        });
      }
    },
    [cursorMode, connectionStart, onConnect, setConnectionStart],
  );

  return (
    <div className="h-screen bg-gray-50 relative ">
      <CanvasView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        cursorMode={cursorMode}
        setCursorMode={setCursorMode}
        setViewMode={setViewMode}
        collapseAll={collapseAll}
        expandAll={expandAll}
      />

      <Toaster position="bottom-right" />
    </div>
  );
};
