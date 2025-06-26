import { useCallback, useState } from "react";
import type { CursorModeType, ViewModeType } from "./canvas.type";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FloatingToolbox } from "./components/FloatingToolbox";
import { SkillNode } from "./components/SkillNode";
import { QuestNode } from "./components/QuestNode";
import "./../../styles/canvas.css";
import { CustomEdge } from "./components/CustomEdge";
import "./../../styles/canvas.css";
import { useCanvasGraph } from "./hooks/useCanvasGraph";
import { usePaneInteraction } from "./hooks/usePaneInteraction";
import { useConnectionHandler } from "./hooks/useConnectionHandler";

const nodeTypes = {
  skill: SkillNode,
  quest1: QuestNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const Canvas = () => {
  const [cursorMode, setCursorMode] = useState<CursorModeType>("normal");
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [, setViewMode] = useState<ViewModeType>("canvas");

  const { screenToFlowPosition } = useReactFlow();

  const {
    nodes,
    // setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    addQuestNode,
  } = useCanvasGraph(); // This hook can be used to manage nodes and edges if needed

  const onConnect = useConnectionHandler(setEdges);
  const onPaneClick = usePaneInteraction({
    mode: cursorMode,
    addQuestNode,
    screenToFlowPosition,
  });

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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        className="custom-canvas"
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onPaneClick={onPaneClick}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        zoomOnScroll={true}
        panOnScroll={false}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#aaa" gap={30} size={0.5} />

        <Controls position="bottom-right" />

        <MiniMap
          nodeStrokeWidth={1}
          position="bottom-left"
          nodeColor={(node) => {
            return node.type === "skill" ? "#ff0000" : "#aaa";
          }}
        />

        {/* Mode Indicators */}
        {cursorMode === "create" && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
            ➕ Click anywhere to create a quest
          </div>
        )}

        {cursorMode === "connect" && (
          <div className="absolute top-4 left-4 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
            🔗 Click quests to connect them
            {/* {connectionStart && <span className="ml-2 text-purple-600">→ Select target quest</span>} */}
          </div>
        )}

        <FloatingToolbox
          cursorMode={cursorMode}
          setCursorMode={setCursorMode}
          setViewMode={setViewMode}
        />
      </ReactFlow>
    </div>
  );
};
