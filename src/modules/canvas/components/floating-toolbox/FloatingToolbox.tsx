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
  <div className="absolute top-6 right-6 z-20 rounded-xl shadow-lg border p-2 flex flex-col gap-1 bg-[rgba(15,10,40,0.85)] border-2 border-[rgba(59,130,246,0.4)] backdrop-blur-md">
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
