import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Pause, Play } from "lucide-react";

type SkillTreeNavigationProps = {
  onBack?: () => void;
  animationEnabled: boolean;
  onToggleAnimation: () => void;
};

export const SkillTreeNavigation = ({ onBack, animationEnabled, onToggleAnimation }: SkillTreeNavigationProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="bg-slate-700/80 cursor-pointer backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
          title="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleAnimation}
        className="bg-slate-700/80 cursor-pointer  backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
        title={animationEnabled ? "Désactiver les animations" : "Activer les animations"}
      >
        {animationEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {animationEnabled ? "Pause" : "Play"}
      </Button>
    </div>
  );
};
