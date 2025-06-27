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

  // This function updates a specific field in the data of a node by its ID.
  const updateNodeData = (id: string, field: string, value: any) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
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
      prev.map((node) =>
        node.type === "quest1"
          ? { ...node, data: { ...node.data, isCollapsed: true } }
          : node
      )
    );
  };

  const expandAll = () => {
    setNodes((prev) =>
      prev.map((node) =>
        node.type === "quest1"
          ? { ...node, data: { ...node.data, isCollapsed: false } }
          : node
      )
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
