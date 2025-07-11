import { Button } from "@/shared/components/ui/button";
import type { ToolBoxItem } from "./toolbox.const";
import type { CursorModeType } from "../../canvas.type";

type ToolButtonProps = {
  tool: ToolBoxItem;
  cursorMode: CursorModeType;
  setCursorMode: (mode: CursorModeType) => void;
  colllapseAll?: () => void;
  expandAll?: () => void;
};

export const ToolButton = ({ tool, cursorMode, setCursorMode, colllapseAll, expandAll }: ToolButtonProps) => {
  const active = tool.isActive(cursorMode);

  return (
    <div className="group relative">
      <Button
        data-tour-id={tool.id}
        variant={`${active ? "default" : "ghost"}`}
        onClick={() =>
          tool.handleToolClick(setCursorMode, cursorMode, {
            collapseAll: colllapseAll,
            expandAll: expandAll,
          })
        }
        size="sm"
        className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
          active ? tool.activeColor + " shadow-md" : "hover:bg-gray-100"
        }`}
      >
        {tool.icon}
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {tool.tooltip}
      </div>
    </div>
  );
};
