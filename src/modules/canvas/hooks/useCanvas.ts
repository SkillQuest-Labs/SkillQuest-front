import { type Node } from "@xyflow/react";

import type { QuestNodeData, SkillNodeData } from "../canvas.type";
// import { useCanvasStore } from "@/stores/quest/use-canvas-store";

export const useCanvas = () => {
  const saveCanvas = (nodes: Node<QuestNodeData | SkillNodeData>[]) => {
    console.log("Saving canvas data is not implemented yet.", nodes);
  };

  return {
    saveCanvas,
  };
};
