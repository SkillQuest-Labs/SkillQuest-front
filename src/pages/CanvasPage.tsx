import { Canvas } from "@/modules/canvas/Canvas";
import { ReactFlowProvider } from "@xyflow/react";

export const CanvasPage = () => {
  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
};
