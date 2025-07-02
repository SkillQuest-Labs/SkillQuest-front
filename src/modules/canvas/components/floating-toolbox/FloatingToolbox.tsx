import type { FloatingToolboxProps } from "../../canvas.type";
import { ToolButton } from "./ToolButton";
import { tools } from "./toolbox.const";

export const FloatingToolbox = ({
  cursorMode,
  setCursorMode,
  // setViewMode,
  collapseAll,
  expandAll,
}: FloatingToolboxProps) => (
  <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-2 flex flex-col gap-1">
    {tools.map((tool) => (
      <ToolButton
        key={tool.id}
        tool={tool}
        cursorMode={cursorMode}
        setCursorMode={setCursorMode}
        colllapseAll={collapseAll}
        expandAll={expandAll}
      />
    ))}
  </div>
);
