import {
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { useCanvasStore } from "@/stores/quest/canvas-store";
import { useCallback } from "react";

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
      setNodes(updateNode);
    },
    [nodes, setNodes],
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
      type: "questNode", // to change type name
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
    deleteNode: removeNode,
    collapseAll,
    expandAll,
  };
};
