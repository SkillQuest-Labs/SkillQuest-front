import { Button } from "@/shared/components/ui/button";
import { CircleDot, RotateCcw } from "lucide-react";

type LayoutToggleProps = {
  layoutType: "spiral" | "concentric";
  onLayoutChange: (layoutType: "spiral" | "concentric") => void;
};

export const LayoutToggle = ({ layoutType, onLayoutChange }: LayoutToggleProps) => {
  const handleLayoutChange = () => {
    const nextLayout = layoutType === "spiral" ? "concentric" : "spiral";
    onLayoutChange(nextLayout);
  };

  const getLayoutLabel = () => {
    return layoutType === "spiral" ? "Spirale" : "Cercles";
  };

  const getLayoutIcon = () => {
    return layoutType === "spiral" ? <RotateCcw className="w-4 h-4" /> : <CircleDot className="w-4 h-4" />;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLayoutChange}
      className="absolute cursor-pointer top-4 right-4 z-10 bg-slate-700/80 backdrop-blur-sm border-slate-500 hover:bg-slate-600/80 text-slate-200 hover:text-white transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
      title={`Layout actuel: ${getLayoutLabel()}. Cliquer pour changer.`}
    >
      {getLayoutIcon()}
      {getLayoutLabel()}
    </Button>
  );
};
