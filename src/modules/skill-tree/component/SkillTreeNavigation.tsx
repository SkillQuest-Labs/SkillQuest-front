import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Pause, Play } from "lucide-react";

type SkillTreeNavigationProps = {
  onBack?: () => void;
  animationEnabled: boolean;
  onToggleAnimation: () => void;
};

export const SkillTreeNavigation = ({ onBack, animationEnabled, onToggleAnimation }: SkillTreeNavigationProps) => {
  return (
    <div className="absolute left-4 top-6 z-20 flex gap-2 md:left-12 md:top-10">
      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-slate-200 shadow-[0_25px_60px_-25px_rgba(56,189,248,0.45)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500/70 cursor-pointer"
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
        className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-slate-700/60 bg-slate-900/70 px-4 text-slate-200 shadow-[0_25px_60px_-25px_rgba(56,189,248,0.45)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-500/70 cursor-pointer"
        title={animationEnabled ? "Désactiver les animations" : "Activer les animations"}
      >
        {animationEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {animationEnabled ? "Pause" : "Play"}
      </Button>
    </div>
  );
};
