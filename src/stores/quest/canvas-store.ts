import { type Edge, type Node } from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { Quest } from "@/shared/types/quest.type";
import { create } from "zustand";
import { initialNodes } from "@/modules/canvas/canvas.const";

type CanvasStore = {
  quests: Quest[];
  nodes: Node<QuestNodeData | SkillNodeData>[];
  newIds: string[];
  modifiedNodesIds: string[];
  edges: Edge[];

  setNodes: (nodes: Node<QuestNodeData | SkillNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  markModifiedNode: (id: string) => void; // to mark a node as modified
  markNew: (id: string) => void; // to mark a node as new
  clearFlags: () => void; // to clear modified and new flags

  addNode: (node: Node<QuestNodeData | SkillNodeData>) => void;
  removeNode: (id: string) => void;
  removeAllQuests: () => void;
  reset: () => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  quests: [],
  nodes: initialNodes,
  modifiedNodesIds: [],
  newIds: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  markModifiedNode: (id: string) =>
    set((state) => ({
      modifiedNodesIds: state.modifiedNodesIds.includes(id) ? state.modifiedNodesIds : [...state.modifiedNodesIds, id],
    })),

  markNew: (id: string) =>
    set((state) => ({
      newIds: state.newIds.includes(id) ? state.newIds : [...state.newIds, id],
    })),

  clearFlags: () => set({ modifiedNodesIds: [], newIds: [] }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (id: string) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
    })),
  removeAllQuests: () => set({ quests: [] }),

  reset: () =>
    set({
      quests: [],
      nodes: initialNodes,
      modifiedNodesIds: [],
      newIds: [],
      edges: [],
    }),
}));
