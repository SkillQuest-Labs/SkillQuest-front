import { type Edge, type Node } from "@xyflow/react";
import type { CursorModeType, QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { create } from "zustand";
import { useSkillStore } from "@/stores/skill/skillStore";
import { useQuestStore } from "../quest/quest-store";

type CanvasStore = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  newIds: string[];
  modifiedNodesIds: string[];
  deletedNodesIds: string[];
  cursorMode: CursorModeType;

  setNodes: (nodes: Node<QuestNodeData | SkillNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setCursorMode: (mode: CursorModeType) => void;

  markModifiedNode: (id: string) => void;
  markNew: (id: string) => void;
  markDeletedNode: (id: string) => void;
  clearFlags: () => void;

  addNode: (node: Node<QuestNodeData | SkillNodeData>) => void;
  removeNode: (id: string) => void;
  reset: () => void;
  resetCanvasStore: () => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  nodes: [],
  edges: [],
  newIds: [],
  modifiedNodesIds: [],
  deletedNodesIds: [],
  cursorMode: "normal",

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setCursorMode: (mode) => set({ cursorMode: mode }),

  markModifiedNode: (id) =>
    set((state) => ({
      modifiedNodesIds: state.modifiedNodesIds.includes(id) ? state.modifiedNodesIds : [...state.modifiedNodesIds, id],
    })),
  markNew: (id) =>
    set((state) => ({
      newIds: state.newIds.includes(id) ? state.newIds : [...state.newIds, id],
    })),
  markDeletedNode: (id) =>
    set((state) => ({
      deletedNodesIds: state.deletedNodesIds.includes(id) ? state.deletedNodesIds : [...state.deletedNodesIds, id],
    })),
  clearFlags: () => set({ modifiedNodesIds: [], newIds: [], deletedNodesIds: [] }),

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (id) => set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),

  reset: () =>
    set({
      nodes: [],
      edges: [],
      newIds: [],
      modifiedNodesIds: [],
      deletedNodesIds: [],
    }),

  resetCanvasStore: () => {
    useQuestStore.getState().reset();
    useSkillStore.getState().reset();
    set({
      nodes: [],
      edges: [],
      newIds: [],
      modifiedNodesIds: [],
      deletedNodesIds: [],
      cursorMode: "normal",
    });
  },
}));
