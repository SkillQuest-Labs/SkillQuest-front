import { Canvas } from "@/modules/canvas/Canvas";
import { ReactFlowProvider } from "@xyflow/react";
import { CanvasOnboarding } from "@/modules/canvas/components/onboarding/CanvasOnboarding";
import { useCanvasOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/shared/components/ui/button";

export const CanvasPage = () => {
  const { completed, reset } = useCanvasOnboardingStore();

  return (
    <div className="relative h-screen">
      <ReactFlowProvider>
        <Canvas />
        <div className="absolute bottom-6 right-6 z-30">
          <Button size="sm" variant="outline" onClick={reset}>
            Rejouer le tutoriel
          </Button>
        </div>
        {!completed && <CanvasOnboarding />}
      </ReactFlowProvider>
    </div>
  );
};
