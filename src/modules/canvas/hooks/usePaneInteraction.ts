import type { XYPosition } from "@xyflow/react";
import type { CursorModeType } from "../canvas.type";
import { useCallback } from "react";

type PaneInteraction = {
  mode: CursorModeType;
  addQuestNode: (pos: XYPosition) => void;
  screenToFlowPosition: (pos: XYPosition) => XYPosition; // Converts screen coordinates to flow coordinates
};

/// This hook handles interactions in the canvas pane, such as creating new quest nodes.
export const usePaneInteraction = ({ mode, addQuestNode, screenToFlowPosition }: PaneInteraction) => {
  return useCallback(
    (event: React.MouseEvent) => {
      if (mode === "create") {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        addQuestNode(position);
      }
    },
    [mode, addQuestNode, screenToFlowPosition],
  );
};
