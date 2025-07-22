import { useCallback, useEffect, useState } from "react";
import type { ViewModeType } from "./canvas.type";
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
import { initialNodes, isSkillNode } from "./canvas.const";
import { useGenerateAIContent } from "./hooks/ai/useGenerateAIContent";
import { useLoadingStore } from "@/stores/loading-store";
import { useSkillStore } from "@/stores/skill/skill-store";
import { createQuestNode } from "@/shared/utils/quetes/quest-node";

export const Canvas = () => {
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [, setViewMode] = useState<ViewModeType>("canvas");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const createSkillParam = searchParams.get("createSkill") === "true";
  const [isModalOpen, setIsModalOpen] = useState(createSkillParam);
  const setNodes = useCanvasStore((state) => state.setNodes);

  const { cursorMode, setCursorMode } = useCanvasStore();
  const { screenToFlowPosition } = useReactFlow();

  const { generate } = useGenerateAIContent();

  useCanvasLoader();

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

  const setLoading = useLoadingStore((state) => state.setLoading);

  const openAIGenerator = async () => {
    setLoading(true);
    try {
      const quests = await generate();
      if (!Array.isArray(quests) || quests.length === 0) return;

      const {
        addNode,
        markNew,
        removeNode,
        setNodes: updateNodes,
        markModifiedNode,
        nodes: currentNodes,
      } = useCanvasStore.getState();
      const setCurrentSkillId = useSkillStore.getState().setCurrentSkillId;

      // Par défaut, la position du skill est { x: 400, y: 50 }
      // On place les quêtes en dessous du skill, espacées horizontalement pour éviter le chevauchement
      const skillNode = currentNodes.find(isSkillNode);
      const skillX = skillNode ? skillNode.position.x : 400;
      const skillY = skillNode ? skillNode.position.y : 50;

      // Place quests starting from x = skillX - 100, y = skillY + 150
      const baseY = skillY + 370;
      const baseX = skillX - 320;
      const questSpacingX = 470;

      quests.forEach((quest, index) => {
        const id = `quest-${crypto.randomUUID()}`;
        const position = { x: baseX + index * questSpacingX, y: baseY };

        const handleUpdate = (field: string, value: any) => {
          const updated = useCanvasStore
            .getState()
            .nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
          updateNodes(updated);
          markModifiedNode(id);
        };

        const newNode = createQuestNode(id, position, removeNode, handleUpdate, {
          title: quest.title,
          xp: quest.xp,
          difficulty: quest.difficulty,
          description: quest.description,
          status: "LOCKED",
        });

        addNode(newNode);
        markNew(id);
        if (skillNode?.id) setCurrentSkillId(skillNode.id);
      });
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

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

      <Toaster position="bottom-right" />
    </div>
  );
};
