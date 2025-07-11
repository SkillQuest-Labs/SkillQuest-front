import { Canvas } from "@/modules/canvas/Canvas";
import { ReactFlowProvider } from "@xyflow/react";
import { CanvasOnboarding } from "@/modules/canvas/components/onboarding/CanvasOnboarding";
import { useCanvasOnboardingStore } from "@/stores/onboarding-store";

export const CanvasPage = () => {
  const { completed } = useCanvasOnboardingStore();

  return (
    <ReactFlowProvider>
      <Canvas />
      {!completed && <CanvasOnboarding />}
    </ReactFlowProvider>
  );
};
