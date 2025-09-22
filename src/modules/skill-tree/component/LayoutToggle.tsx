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
    <div className="absolute right-4 top-6 z-20 flex gap-1 rounded-full border border-slate-700/60 bg-slate-900/70 p-1 shadow-[0_25px_60px_-25px_rgba(99,102,241,0.45)] backdrop-blur md:right-12 md:top-10">
      {LAYOUTS.map(({ value, label, icon }) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className={`flex cursor-pointer items-center gap-2 rounded-full px-3 text-xs font-semibold transition-all duration-200 ${
            layoutType === value
              ? "bg-gradient-to-r from-sky-500/80 to-cyan-400/80 text-white shadow-[0_12px_35px_-18px_rgba(14,165,233,0.6)]"
              : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
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
