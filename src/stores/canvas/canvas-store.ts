import { type Edge, type Node } from "@xyflow/react";
import type { CursorModeType, QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { Quest } from "@/shared/types/quest.type";
import { create } from "zustand";

export type LoadingType = "spinner" | "progress";

export interface ILoading {
  isLoading: boolean;
  type: LoadingType;
}

type CanvasStore = {
  quests: Quest[];
  nodes: Node<QuestNodeData | SkillNodeData>[];
  newNodeIds: string[];
  modifiedNodesIds: string[];
  deletedNodesIds: string[];

  edges: Edge[];
  newEdgeIds: string[];
  deletedEdgeIds: string[];

  cursorMode: CursorModeType;
  loading: ILoading;

  setNodes: (nodes: Node<QuestNodeData | SkillNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;

  setLoading: (loading: ILoading) => void;

  setCursorMode: (mode: CursorModeType) => void;

  markModifiedNode: (id: string) => void; // to mark a node as modified
  markNodeNew: (id: string) => void; // to mark a node as new
  markDeletedNode: (id: string) => void; // to mark a node as deleted

  markNewEdge: (id: string) => void;
  markDeleteEdge: (id: string) => void;

  clearFlags: () => void; // to clear modified and new flags

  addNode: (node: Node<QuestNodeData | SkillNodeData>) => void;
  removeNode: (id: string) => void;
  removeAllQuests: () => void;
  reset: () => void;
};

export const useCanvasStore = create<CanvasStore>((set) => ({
  quests: [],
  nodes: [],
  modifiedNodesIds: [],
  newNodeIds: [],
  deletedNodesIds: [],
  edges: [],
  newEdgeIds: [],
  deletedEdgeIds: [],
  cursorMode: "normal",
  loading: {
    isLoading: false,
    type: "spinner",
  },

  setLoading: (loading) => set({ loading }),
  setCursorMode: (mode: CursorModeType) => set({ cursorMode: mode }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  markModifiedNode: (id: string) =>
    set((state) => ({
      modifiedNodesIds: state.modifiedNodesIds.includes(id) ? state.modifiedNodesIds : [...state.modifiedNodesIds, id],
    })),

  markNodeNew: (id: string) =>
    set((state) => ({
      newNodeIds: state.newNodeIds.includes(id) ? state.newNodeIds : [...state.newNodeIds, id],
    })),

  markDeletedNode: (id: string) =>
    set((state) => ({
      deletedNodesIds: state.deletedNodesIds.includes(id) ? state.deletedNodesIds : [...state.deletedNodesIds, id],
    })),

  markNewEdge: (id: string) =>
    set((state) => ({
      newEdgeIds: state.newEdgeIds.includes(id) ? state.newEdgeIds : [...state.newEdgeIds, id],
    })),

  markDeleteEdge: (id: string) =>
    set((state) => ({
      deletedEdgeIds: state.deletedEdgeIds.includes(id) ? state.deletedEdgeIds : [...state.deletedEdgeIds, id],
    })),

  clearFlags: () =>
    set({ modifiedNodesIds: [], newNodeIds: [], deletedNodesIds: [], newEdgeIds: [], deletedEdgeIds: [] }),

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
      newNodeIds: [],
      edges: [],
      newEdgeIds: [],
      deletedNodesIds: [],
    }),
}));
