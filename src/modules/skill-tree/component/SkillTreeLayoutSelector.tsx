import { Button } from "@/shared/components/ui/button";
import { LayoutGrid, Circle } from "lucide-react";
import type { SkillTreeLayoutType } from "../skill-tree.type";

type SkillTreeLayoutSelectorProps = {
  currentLayout: SkillTreeLayoutType;
  availableLayouts: SkillTreeLayoutType[];
  onLayoutChange: (layout: SkillTreeLayoutType) => void;
  className?: string;
};

const layoutConfig = {
  circular: {
    label: "Vue Circulaire",
    icon: Circle,
    description: "Arbre concentrique avec le skill au centre",
  },
  hierarchical: {
    label: "Vue Hiérarchique",
    icon: LayoutGrid,
    description: "Arbre vertical avec niveaux de progression",
  },
} as const;

export const SkillTreeLayoutSelector = ({
  currentLayout,
  availableLayouts,
  onLayoutChange,
  className = "",
}: SkillTreeLayoutSelectorProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Toggle buttons for quick switch */}
      <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-600">
        {availableLayouts.map((layout) => {
          const config = layoutConfig[layout];
          const Icon = config.icon;
          const isActive = currentLayout === layout;

          return (
            <Button
              key={layout}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onLayoutChange(layout)}
              className={`
                relative px-3 py-2 text-xs font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-slate-700 text-slate-200 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                }
              `}
              title={config.description}
            >
              <Icon className="w-4 h-4 mr-1" />
              {config.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
