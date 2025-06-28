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

    {/* Divider */}
    <div className="h-px bg-gray-200 my-1" />

    {/* Generate Roadmap Tool */}
    {/* <div className="group relative">
      <Button
        onClick={() => {
          setViewMode("timeline");
          setCursorMode("normal");
        }}
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-lg hover:bg-green-100 hover:text-green-700 transition-all duration-200"
      >
        <Map className="w-5 h-5" />
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Generate Roadmap
      </div>
    </div> */}
  </div>
);
