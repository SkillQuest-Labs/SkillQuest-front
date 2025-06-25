import { useCallback, useState } from "react";
import type {
  CursorModeType,
  QuestData,
  SkillConfigType,
  SkillNodeData,
  ViewModeType,
} from "./canva.type";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FloatingToolbox } from "./components/FloatingToolbox";
import { skillConfigMockData } from "./canvas.const";
import { SkillNode } from "./components/SkillNode";
import { QuestNode } from "./components/QuestNode";
import "./../../styles/canvas.css";
import { CustomEdge } from "./components/CustomEdge";
import ShootingStars from "./components/animations/ShootingStars";
import "./../../styles/canvas.css";

const nodeTypes = {
  skill: SkillNode,
  quest1: QuestNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export const Canva = () => {
  const [cursorMode, setCursorMode] = useState<CursorModeType>("normal");
  const [, setViewMode] = useState<ViewModeType>("canvas");
  const [skillConfig, setSkillConfig] =
    useState<SkillConfigType>(skillConfigMockData);

  // Initialize edges and nodes

  const initialNodes: Node<SkillNodeData | QuestData>[] = [
    // later we need to retrieve the real data from the modal that we open
    {
      id: "skill-block",
      type: "skill",
      position: { x: 400, y: 50 },
      data: {
        config: skillConfig,
        onUpdate: (field: string, value: any) =>
          setSkillConfig((prev) => ({ ...prev, [field]: value })),
      },
      draggable: true,
    },
    {
      id: "quest-block1",
      type: "quest1",
      position: { x: 500, y: 400 },
      data: {
        config: skillConfig,
        onUpdate: (field: string, value: any) => {
          setSkillConfig((prev) => ({ ...prev, [field]: value })); // change to create state to update quest
        },
        onDelete: (id: string) =>
          setNodes((prev) => prev.filter((n) => n.id !== id)),
      },
      draggable: true,
    },
  ];

  const [edges] = useEdgesState([
    // Initial edges connecting the nodes

    {
      id: "e1-3",
      source: "skill-block",
      target: "quest-block1",
      type: "custom",
      animated: true,
    },
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const { screenToFlowPosition } = useReactFlow();

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (cursorMode === "create") {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNodeId = `quest-${Date.now()}`;
        const newNode: Node<QuestData> = {
          id: newNodeId,
          type: "quest1",
          position,
          data: {
            title: "New Quest",
            xp: 100,
            difficulty: "Medium",
            description: "Quest description...",
            status: "not-started",
            type: "side",
            onDelete: (id: string) =>
              setNodes((prev) => prev.filter((n) => n.id !== id)),
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [cursorMode, setNodes, screenToFlowPosition],
  );

  return (
    <div className="h-screen bg-gray-50 relative ">
      <ShootingStars />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        className="custom-canvas"
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onPaneClick={onPaneClick}
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
