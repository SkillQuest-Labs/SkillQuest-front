import {
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import type {
  CursorModeType,
  QuestNodeData,
  SkillNodeData,
  ViewModeType,
} from "../canvas.type";
import { SkillNode } from "./SkillNode";
import { QuestNode } from "./QuestNode";
import { CustomEdge } from "./CustomEdge";

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
};

const nodeTypes = {
  skill: SkillNode,
  quest1: QuestNode,
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
//   cursorMode,
//   setCursorMode,
//   setViewMode,
}: CanvasViewProps) => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
    edgeTypes={edgeTypes}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onPaneClick={onPaneClick}
    onNodeClick={onNodeClick}
    onConnect={onConnect}
  ></ReactFlow>
);
