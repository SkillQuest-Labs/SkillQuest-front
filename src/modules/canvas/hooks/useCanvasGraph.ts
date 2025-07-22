import {
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useCallback } from "react";
import type { Skill } from "@/shared/types/skill.type";
import { isQuestNode } from "../canvas.const";
import { useSkillStore } from "@/stores/skill/skill-store";
import { createQuestNode } from "@/shared/utils/quetes/quest-node";

// This hook manages the state of nodes and edges in the canvas graph.
export const useCanvasGraph = () => {
  const nodes = useCanvasStore((state) => state.nodes);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const edges = useCanvasStore((state) => state.edges);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const addNode = useCanvasStore((state) => state.addNode);
  const removeNode = useCanvasStore((state) => state.removeNode);
  const markModifiedNode = useCanvasStore((state) => state.markModifiedNode);
  const markNew = useCanvasStore((state) => state.markNew);

  const setCurrentSkillId = useSkillStore.getState().setCurrentSkillId;

  const updateNodeData = useCallback(
    (id: string, field: string, value: any) => {
      const current = useCanvasStore.getState().nodes;
      const updated = current.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
      setNodes(updated);
      markModifiedNode(id);
    },
    [setNodes, markModifiedNode],
  );

  const onNodesChange: OnNodesChange<Node<QuestNodeData | SkillNodeData>> = useCallback(
    (changes) => {
      const updateNode = applyNodeChanges<Node<QuestNodeData | SkillNodeData>>(changes, nodes);
      changes.forEach((change) => {
        if (change.type === "position" && change.id) {
          markModifiedNode(change.id);
        }
      });

      setNodes(updateNode);
    },
    [nodes, setNodes, markModifiedNode],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges);
    },
    [edges, setEdges],
  );

  const addQuestNode = (position: XYPosition) => {
    const id = `quest-${crypto.randomUUID()}`;

    const newNode = createQuestNode(id, position, removeNode, updateNodeData);
    addNode(newNode);
    markNew(id);
  };

  const addSkillNode = (position: XYPosition, skill: Skill) => {
    const id = `skill-${crypto.randomUUID()}`;
    const newNode: Node<SkillNodeData> = {
      id: id,
      type: "skill",
      position,
      data: {
        kind: "skill",
        config: {
          title: skill.title || "New Skill",
          description: skill.description || "Skill description...",
          status: skill.status || "DRAFT",
          difficulty: skill.difficulty,
          color: "from-blue-500 to-indigo-600",
        },
        // onUpdate: (field: string, value: any) => updateNodeData(id, field, value),
      },
    };

    // Retrieve the current nodes
    const prevNodes = useCanvasStore.getState().nodes;
    const hasSkillNode = prevNodes.some((n) => !isQuestNode(n));
    if (hasSkillNode) {
      const newNodes = prevNodes.map((n) => (!isQuestNode(n) ? newNode : n));
      setNodes(newNodes);
      markNew(id);
      setCurrentSkillId(id);
    }
  };

  const collapseAll = useCallback(() => {
    const storeNodes = useCanvasStore.getState().nodes;
    setNodes(
      storeNodes.map((node) =>
        node.type === "questNode" ? { ...node, data: { ...node.data, isCollapsed: true } } : node,
      ),
    );
  }, [setNodes]);

  const expandAll = useCallback(() => {
    setNodes(
      nodes.map((node) => (node.type === "questNode" ? { ...node, data: { ...node.data, isCollapsed: false } } : node)),
    );
  }, [setNodes, nodes]);

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    addQuestNode,
    addSkillNode,
    deleteNode: removeNode,
    collapseAll,
    expandAll,
  };
};
