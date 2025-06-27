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
        onDelete: (id: string) =>
          setNodes((prev) => prev.filter((n) => n.id !== id)),
      },
    };

    setNodes((prev) => [...prev, newNode]);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
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
  };
};
