import { Canvas } from "@/modules/canvas/Canvas";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";

export const CanvasPage = () => {
  const resetCanvasStore = useCanvasStore((state) => state.resetCanvasStore);

  useEffect(() => {
    return () => {
      resetCanvasStore();
    };
  }, [resetCanvasStore]);

  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
};
