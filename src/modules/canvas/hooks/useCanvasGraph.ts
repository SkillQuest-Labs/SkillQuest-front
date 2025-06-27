import {
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type XYPosition,
} from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { initialNodes } from "../canvas.const";

// This hook manages the state of nodes and edges in the canvas graph.
export const useCanvasGraph = () => {
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<QuestNodeData | SkillNodeData>>(initialNodes);

  const updateNodeData = (id: string, field: string, value: any) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, data: { ...(n.data as any), [field]: value } }
          : n,
      ),
    );
  };

  const addQuestNode = (position: XYPosition) => {
    const id = `quest-${Date.now()}`; // to change

    const newNode: Node<QuestNodeData> = {
      id: id,
      type: "quest1", // to change type name
      position,
      data: {
        title: "New Quest",
        xp: 100,
        difficulty: "Medium",
        description: "Quest description...",
        status: "not-started",
        type: "side",
        isCollapsed: false,
        onDelete: (id: string) =>
          setNodes((prev) => prev.filter((n) => n.id !== id)),
        onUpdate: (field: string, value: any) =>
          updateNodeData(id, field, value),
      },
    };

    setNodes((prev) => [...prev, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const collapseAll = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.type === "quest1"
          ? { ...n, data: { ...(n.data as any), isCollapsed: true } }
          : n,
      ),
    );
  };

  const expandAll = () => {
    setNodes((prev) =>
      prev.map((n) =>
        n.type === "quest1"
          ? { ...n, data: { ...(n.data as any), isCollapsed: false } }
          : n,
      ),
    );
  };

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    addQuestNode,
    deleteNode,
    collapseAll,
    expandAll,
  };
};
