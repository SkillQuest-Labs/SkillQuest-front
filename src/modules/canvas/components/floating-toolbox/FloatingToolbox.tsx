import { useCallback, useState } from "react";
import type { CursorModeType, FloatingToolboxProps } from "../../canvas.type";
import { ToolButton } from "./ToolButton";
import { tools } from "./toolbox.const";
import { ChevronsDownUp, Maximize2 } from "lucide-react";

export const FloatingToolbox = ({
  cursorMode,
  setCursorMode,
  // setViewMode,
  collapseAll,
  expandAll,
}: FloatingToolboxProps) => {
  const [areNodesCollapsed, setAreNodesCollapsed] = useState<boolean>(false);

  const toggleCollapseAll = useCallback(() => {
    if (areNodesCollapsed) {
      expandAll();
      setAreNodesCollapsed(false);
      setCursorMode("expand");
    } else {
      collapseAll();
      setAreNodesCollapsed(true);
      setCursorMode("collapse");
    }
  }, [areNodesCollapsed, collapseAll, expandAll, setCursorMode]);

  const collapseExpandTool = areNodesCollapsed
    ? {
        id: "collapse",
        icon: <ChevronsDownUp className="w-5 h-5" />,
        tooltip: "Collapse All Quests",
        activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
        isActive: (mode: CursorModeType) => mode === "collapse",
        handleToolClick: () => {
          toggleCollapseAll();
        },
      }
    : {
        id: "expand",
        icon: <Maximize2 className="w-5 h-5 transform rotate-180" />,
        tooltip: "Expand All Quests",
        activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
        isActive: (mode: CursorModeType) => mode === "expand",
        handleToolClick: () => {
          toggleCollapseAll();
        },
      };

  const allTools = [...tools, collapseExpandTool];

  return (
    <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-2 flex flex-col gap-1">
      {allTools.map((tool) => (
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
};
