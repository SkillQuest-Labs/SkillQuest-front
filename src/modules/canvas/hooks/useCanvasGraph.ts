import {
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { useQuestStore } from "@/stores/quest/quest-store";
import { useCallback } from "react";
import type { Skill } from "@/shared/types/skill.type";

// This hook manages the state of nodes and edges in the canvas graph.
export const useCanvasGraph = () => {
  const nodes = useQuestStore((state) => state.nodes);
  const setNodes = useQuestStore((state) => state.setNodes);
  const edges = useQuestStore((state) => state.edges);
  const setEdges = useQuestStore((state) => state.setEdges);
  const addNode = useQuestStore((state) => state.addNode);
  const removeNode = useQuestStore((state) => state.removeNode);
  const markModifiedNode = useQuestStore((state) => state.markModifiedNode);
  const markNew = useQuestStore((state) => state.markNew);

  const updateNodeData = useCallback(
    (id: string, field: string, value: any) => {
      const current = useQuestStore.getState().nodes;
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
    const id = `quest-${Date.now()}`; // to change

    const newNode: Node<QuestNodeData> = {
      id: id,
      type: "questNode",
      position,
      data: {
        kind: "quest",
        title: "New Quest",
        xp: 100,
        difficulty: "EASY",
        description: "Quest description...",
        status: "LOCKED",
        isCollapsed: false,
        onDelete: (nid: string) => removeNode(nid),
        onUpdate: (field: string, value: any) => updateNodeData(id, field, value),
      },
    };

    addNode(newNode);
    markNew(id);
  };

  const addSkillNode = (skill: Skill) => {
    const newSkillNode: Node<SkillNodeData> = {
      id: `skill-${skill.id}`,
      type: "skill",
      position: { x: 400, y: 50 },
      data: {
        kind: "skill",
        config: { ...skill },
      },
      draggable: true,
    };

    addNode(newSkillNode);
    markNew(newSkillNode.id);
  };

  const collapseAll = useCallback(() => {
    const storeNodes = useQuestStore.getState().nodes;
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
