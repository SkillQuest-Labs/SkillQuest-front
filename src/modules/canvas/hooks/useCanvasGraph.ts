import {
  applyEdgeChanges,
  applyNodeChanges,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type XYPosition,
} from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { useCanvasStore } from "@/stores/quest/use-canvas-store";
import { useCallback } from "react";

// This hook manages the state of nodes and edges in the canvas graph.
export const useCanvasGraph = () => {
  const nodes = useCanvasStore((state) => state.nodes);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const edges = useCanvasStore((state) => state.edges);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const addNode = useCanvasStore((s) => s.addNode);
  const removeNode = useCanvasStore((s) => s.removeNode);

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

  // This function updates a specific field in the data of a node by its ID.
  const updateNodeData = useCallback(
    (id: string, field: string, value: any) => {
      const current = useCanvasStore.getState().nodes;
      const updated = current.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
      setNodes(updated);
    },
    [setNodes],
  );

  const addQuestNode = (position: XYPosition) => {
    const id = `quest-${Date.now()}`; // to change

    const newNode: Node<QuestNodeData> = {
      id: id,
      type: "quest1", // to change type name
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
  };

  const collapseAll = useCallback(() => {
    setNodes(
      nodes.map((node) => (node.id === "quest1" ? { ...node, data: { ...node.data, isCollapsed: true } } : node)),
    );
  }, [setNodes, nodes]);

  const expandAll = useCallback(() => {
    setNodes(
      nodes.map((node) => (node.id === "quest1" ? { ...node, data: { ...node.data, isCollapsed: false } } : node)),
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
