import { useState } from "react";
import { renderConcentricCircles } from "@/modules/skill-tree/render-concentric-circles";
import { Button } from "@/shared/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";

export const SkillTreePage = () => {
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Center the skill tree in the middle of the container
  const centerX = 600;
  const centerY = 400;

  return (
    <div className="w-full h-screen overflow-hidden relative flex items-center justify-center bg-slate-900">
      <div className="relative border border-slate-600 rounded-lg bg-slate-800 w-[1200px] h-[800px]">
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

        {renderConcentricCircles({ skillnodes: [], centerX, centerY, options: { animationEnabled } })}
      </div>
    </div>
  );
};
