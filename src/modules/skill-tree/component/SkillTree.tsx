import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { PauseIcon, PlayIcon, ChevronLeft } from "lucide-react";
import { renderConcentricCircles } from "./concentric-circles/render-concentric-circles.const";

export type SkillTreeProps = {
  onBack?: () => void;
};

export const SkillTree = ({ onBack }: SkillTreeProps) => {
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Center the skill tree in the middle of the container
  const centerX = 600;
  const centerY = 400;

  return (
    <div className="w-full h-screen overflow-hidden relative flex items-center justify-center bg-slate-900">
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
      )}
      <div className="relative  w-full h-[800px]">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnimationEnabled(!animationEnabled)}
          className="absolute top-4 right-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg"
        >
          {animationEnabled ? (
            <>
              <PauseIcon className="inline-block w-4 h-4 mr-1" /> Pause
            </>
          ) : (
            <>
              <PlayIcon className="inline-block w-4 h-4 mr-1" /> Play
            </>
          )}
        </Button>

        {renderConcentricCircles({
          skillnodes: [],
          centerX,
          centerY,
          options: { animationEnabled },
        })}
      </div>
    </div>
  );
};
