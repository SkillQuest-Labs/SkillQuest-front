import { useEffect, useRef } from "react";
import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { type Node } from "@xyflow/react";

/**
 * This hook automatically saves the canvas every 2.5 seconds
 * when the user attempts to leave the page (beforeunload event).
 */
/**
 * useAutoSaveCanvas
 * - Automatically saves the canvas after a debounce delay when nodes change.
 * - Saves the canvas when the user attempts to leave the page.
 */
export function useAutoSaveCanvas(
  nodes: Node<SkillNodeData | QuestNodeData>[],
  saveCanvas: () => void,
  debounceDelay: number = 2500,
) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced auto-save when nodes change
  useEffect(() => {
    if (!nodes) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveCanvas();
    }, debounceDelay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [nodes, saveCanvas, debounceDelay]);

  // Save on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCanvas();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveCanvas]);
}
