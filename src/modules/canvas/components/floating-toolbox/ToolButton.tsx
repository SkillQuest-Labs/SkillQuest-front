import { Button } from "@/shared/components/ui/button";
import type { ToolBoxItem } from "./toolbox.const";
import type { CursorModeType, ViewModeType } from "../../canvas.type";

type ToolButtonProps = {
  tool: ToolBoxItem;
  cursorMode: CursorModeType;
  setCursorMode: (mode: CursorModeType) => void;
  context?: {
    collapseAll?: () => void;
    expandAll?: () => void;
    setViewMode?: (mode: ViewModeType) => void;
    openAIGenerator?: () => void;
  };
};

export const ToolButton = ({ tool, cursorMode, setCursorMode, context }: ToolButtonProps) => {
  const active = tool.isActive(cursorMode);

  return (
    <div className="group relative">
      <Button
        title={tool.title}
        variant={`${active ? "default" : "ghost"}`}
        onClick={() => tool.handleToolClick(setCursorMode, cursorMode, context)}
        size="sm"
        className={`w-10 h-10 p-0 cursor-pointer rounded-lg transition-all duration-200 ${
          active ? tool.activeColor + " shadow-md" : "hover:bg-gray-100"
        }`}
        data-tour={tool.id}
      >
        {tool.icon}
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {tool.tooltip}
      </div>
    </div>
  );
};
