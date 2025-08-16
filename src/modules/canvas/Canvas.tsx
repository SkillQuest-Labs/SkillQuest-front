import { useCallback, useEffect, useState } from "react";
import type { QuestNodeData, ViewModeType } from "./canvas.type";
import { useReactFlow, type Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./../../styles/canvas.css";
import { useCanvasGraph } from "./hooks/useCanvasGraph";
import { usePaneInteraction } from "./hooks/usePaneInteraction";
import { useConnectionHandler } from "./hooks/useConnectionHandler";
import { CanvasView } from "./components/CanvasView";
import { useCanvasLoader, useSaveCanvas } from "./hooks/useSaveCanvas";
import { Toaster } from "@/shared/components/ui/sonner";
import { useAutoSaveCanvas } from "./hooks/useAutoSaveCanvas";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreateSkillModal } from "./components/CreateSkillModal";
import type { Skill } from "@/shared/types/skill.type";
import { initialNodes } from "./canvas.const";
import { useAddAIQuests } from "./hooks/useAddAIQuest";
import { QuestDetailsModal } from "./components/quest-card-component/QuestDetailsModal";

export const Canvas = () => {
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [, setViewMode] = useState<ViewModeType>("canvas");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const createSkillParam = searchParams.get("createSkill") === "true";
  const [isModalOpen, setIsModalOpen] = useState(createSkillParam);
  const [selectedQuest, setSelectedQuest] = useState<QuestNodeData | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const setNodes = useCanvasStore((state) => state.setNodes);

  const { cursorMode, setCursorMode } = useCanvasStore();
  const { screenToFlowPosition } = useReactFlow();

  useCanvasLoader();

  const { addGeneratedQuests: openAIGenerator } = useAddAIQuests();

  const {
    nodes,
    // setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    addQuestNode,
    addSkillNode,
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

  const handleCreateSkill = useCallback(
    (skill: Skill) => {
      addSkillNode({ x: 400, y: 50 }, skill);
    },
    [addSkillNode],
  );

  // - If no start point is selected, stores the clicked node's id.
  // - Otherwise, connects the start node to the clicked node and resets the selection.
  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation();

      if (cursorMode === "connect") {
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
      }

      if (cursorMode === "normal" && node.type === "questNode") {
        setSelectedQuest(node.data as QuestNodeData);
        setIsQuestModalOpen(true);
      }
    },
    [cursorMode, connectionStart, onConnect, setConnectionStart, setSelectedQuest, setIsQuestModalOpen],
  );

  useEffect(() => {
    setIsModalOpen(createSkillParam);
  }, [createSkillParam]);

  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(initialNodes);
    }
  }, [nodes, setNodes]);

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
        openAIGenerator={openAIGenerator}
      />

      <CreateSkillModal
        open={isModalOpen}
        onCreate={handleCreateSkill}
        onClose={() => {
          setIsModalOpen(false);
          setSearchParams({});
          navigate("/canvas");
        }}
      />

      <QuestDetailsModal open={isQuestModalOpen} quest={selectedQuest} onClose={() => setIsQuestModalOpen(false)} />

      <Toaster position="bottom-right" />
    </div>
  );
};
