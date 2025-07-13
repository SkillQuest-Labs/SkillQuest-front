import { type Edge, type Node } from "@xyflow/react";
import type { CursorModeType, QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { Quest } from "@/shared/types/quest.type";
import { create } from "zustand";

type QuestStore = {
  quests: Quest[];
  nodes: Node<QuestNodeData | SkillNodeData>[];
  newIds: string[];
  modifiedNodesIds: string[];
  deletedNodesIds: string[];
  edges: Edge[];
  cursorMode: CursorModeType;

  setNodes: (nodes: Node<QuestNodeData | SkillNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  setCursorMode: (mode: CursorModeType) => void;

  markModifiedNode: (id: string) => void; // to mark a node as modified
  markNew: (id: string) => void; // to mark a node as new
  markDeletedNode: (id: string) => void; // to mark a node as deleted
  clearFlags: () => void; // to clear modified and new flags

  addNode: (node: Node<QuestNodeData | SkillNodeData>) => void;
  removeNode: (id: string) => void;
  removeAllQuests: () => void;
  reset: () => void;
};

export const useQuestStore = create<QuestStore>((set) => ({
  quests: [],
  nodes: [],
  modifiedNodesIds: [],
  newIds: [],
  deletedNodesIds: [],
  edges: [],

  cursorMode: "normal",
  setCursorMode: (mode: CursorModeType) => set({ cursorMode: mode }),

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

  markDeletedNode: (id: string) =>
    set((state) => ({
      deletedNodesIds: state.deletedNodesIds.includes(id) ? state.deletedNodesIds : [...state.deletedNodesIds, id],
    })),

  clearFlags: () => set({ modifiedNodesIds: [], newIds: [], deletedNodesIds: [] }),

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
      nodes: [],
      modifiedNodesIds: [],
      newIds: [],
      edges: [],
    }),
}));
