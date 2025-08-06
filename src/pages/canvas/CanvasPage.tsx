import { Canvas } from "@/modules/canvas/Canvas";
import { SkillTree } from "@/modules/skill-tree/component/SkillTree";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { ReactFlowProvider } from "@xyflow/react";
import { useCallback } from "react";

export const CanvasPage = () => {
  const viewMode = useCanvasStore((state) => state.viewMode);
  const setViewMode = useCanvasStore((state) => state.setViewMode);

  const handleBack = useCallback(() => setViewMode("canvas"), [setViewMode]);

  if (viewMode === "skillTree") {
    return <SkillTree onBack={handleBack} />;
  }

  return (
    <ReactFlowProvider>
      <Canvas />
    </ReactFlowProvider>
  );
};
