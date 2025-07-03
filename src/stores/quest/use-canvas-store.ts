import { type Edge, type Node } from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { Quest } from "@/shared/types/quest.type";
import { create } from "zustand";
import { initialNodes } from "@/modules/canvas/canvas.const";

type CanvasStore = {
  quests: Quest[];
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];

  setNodes: (nodes: Node<QuestNodeData | SkillNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  addNode: (node: Node<QuestNodeData | SkillNodeData>) => void;
  removeNode: (id: string) => void;
  addQuest: (quest: Quest) => void;
  removeQuest: (questId: string) => void;
  removeAllQuests: () => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  quests: [],
  nodes: initialNodes,
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  removeNode: (id: string) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
    })),

  addQuest: (quest) => set((state) => ({ quests: [...state.quests, quest] })),

  removeQuest: (questId: string) =>
    set((state) => ({
      quests: state.quests.filter((quest) => quest.id !== questId),
    })),

  removeAllQuests: () => set({ quests: [] }),

  reset: () => set({ quests: [] }),
}));
