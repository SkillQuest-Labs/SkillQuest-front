import clsx from "clsx";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import type { CursorModeType, QuestNodeData, SkillNodeData, ViewModeType } from "../canvas.type";
import { SkillNode } from "./SkillNode";
import { QuestNode } from "./QuestNode";
import { CustomEdge } from "./CustomEdge";
import { FloatingToolbox } from "./floating-toolbox/FloatingToolbox";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useCanvasStore } from "@/stores/quest/canvas-store";

type CanvasViewProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node<QuestNodeData | SkillNodeData>>;
  onEdgesChange: OnEdgesChange<Edge>;
  onPaneClick: (event: React.MouseEvent) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onConnect: (params: Connection) => void;
  cursorMode: CursorModeType;
  setCursorMode: (mode: CursorModeType) => void;
  setViewMode: React.Dispatch<React.SetStateAction<ViewModeType>>;
  className?: string;
  collapseAll: () => void;
  expandAll: () => void;
};

const nodeTypes = {
  skill: SkillNode,
  questNode: QuestNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const CanvasView = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onPaneClick,
  onNodeClick,
  onConnect,
  cursorMode,
  className,
  setCursorMode,
  setViewMode,
  collapseAll,
  expandAll,
}: CanvasViewProps) => {
  const navigate = useNavigate();

  const reset = useCanvasStore.getState().reset;

  return (
    <ReactFlow
      onInit={(reactFlowInstance) => {
        reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 0.5 }, { duration: 800 });
      }}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      className={clsx("custom-canvas", className)}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={onPaneClick}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      isValidConnection={(connection) => {
        // Prevent self-connections
        return connection.source !== connection.target;
      }}
      zoomOnScroll={false}
      panOnScroll={true}
      minZoom={0.2}
      maxZoom={2}
      fitView
      connectionRadius={200}
      snapToGrid={true}
      snapGrid={[30, 30]}
    >
      <Background color="#aaa" gap={30} size={0.5} />

      <Controls position="bottom-right" />

      <MiniMap
        nodeStrokeWidth={2}
        position="bottom-left"
        nodeColor={(node) => {
          return node.type === "skill" ? "#3b82f6" : "#10b981";
        }}
        style={{
          backgroundColor: "rgba(12, 8, 33, 0.8)",
          border: "2px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
        }}
        maskColor="rgba(12, 8, 33, 0.4)"
        className="shadow-2xl "
      />

      <div className="absolute top-6 left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          aria-label="Retour au tableau de bord"
          onClick={() => {
            reset();
            navigate("/dashboard");
          }}
          className="bg-[#0C0821] hover:bg-gray-700 text-white hover:text-white px-4 py-2 rounded-lg shadow-lg transition-colors cursor-pointer duration-200 flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Retour
        </Button>
      </div>

      <FloatingToolbox
        cursorMode={cursorMode}
        setCursorMode={setCursorMode}
        setViewMode={setViewMode}
        collapseAll={collapseAll}
        expandAll={expandAll}
      />

      {/* Mode Indicators */}
      {cursorMode === "create" && (
        <div className="absolute top-5 left-30 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
          ➕ Click anywhere to create a quest
        </div>
      )}

      {cursorMode === "connect" && (
        <div className="absolute top-5 left-30 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
          🔗 Click quests to connect them
          {/* {connectionStart && <span className="ml-2 text-purple-600">→ Select target quest</span>} */}
        </div>
      )}
    </ReactFlow>
  );
};
