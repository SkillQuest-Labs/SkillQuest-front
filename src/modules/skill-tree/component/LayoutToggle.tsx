import { Button } from "@/shared/components/ui/button";
import { CircleDot, RotateCcw } from "lucide-react";
import React from "react";

const LAYOUTS: Array<{
  value: LayoutType;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "spiral", label: "Spirale", icon: <RotateCcw className="w-4 h-4" /> },
  { value: "concentric", label: "Cercles", icon: <CircleDot className="w-4 h-4" /> },
];

type LayoutType = "spiral" | "concentric";

type LayoutToggleProps = {
  layoutType: LayoutType;
  onLayoutChange: (layoutType: LayoutType) => void;
};

export const LayoutToggle = ({ layoutType, onLayoutChange }: LayoutToggleProps) => {
  return (
    <div className="absolute  top-4 right-4 z-10 flex gap-2 bg-slate-800/70 backdrop-blur-sm border border-slate-600/60 rounded-xl p-1 shadow-lg">
      {LAYOUTS.map(({ value, label, icon }) => (
        <Button
          key={value}
          variant={layoutType === value ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 cursor-pointer text-xs font-medium transition-all duration-200 ${
            layoutType === value
              ? "bg-cyan-500/80 hover:bg-cyan-500 text-white shadow-md"
              : "text-slate-300 hover:bg-slate-700/70"
          }`}
          onClick={() => onLayoutChange(value)}
          title={`Afficher le layout ${label}`}
        >
          {icon}
          {label}
        </Button>
      ))}
    </div>
  );
};
