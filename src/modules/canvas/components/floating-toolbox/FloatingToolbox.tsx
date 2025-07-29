import { useCallback, useState } from "react";
import type { CursorModeType, FloatingToolboxProps } from "../../canvas.type";
import { ToolButton } from "./ToolButton";
import { tools } from "./toolbox.const";
import { ChevronsDownUp, Loader2, Maximize2, Sparkles } from "lucide-react";
import { useLoadingStore } from "@/stores/loading-store";

export const FloatingToolbox = ({
  cursorMode,
  setCursorMode,
  // setViewMode,
  collapseAll,
  expandAll,
  // openAIGenerator,
  setOpenAiModal,
}: FloatingToolboxProps) => {
  const [areNodesCollapsed, setAreNodesCollapsed] = useState<boolean>(false);
  const isLoading = useLoadingStore((state) => state.isLoading);

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
        icon: <ChevronsDownUp className="w-5 h-5 text-white group-hover:text-black transition-colors" />,
        tooltip: "Collapse All Quests",
        activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
        isActive: (mode: CursorModeType) => mode === "collapse",
        handleToolClick: () => {
          toggleCollapseAll();
        },
      }
    : {
        id: "expand",
        icon: (
          <Maximize2 className="w-5 h-5 transform rotate-180 text-white group-hover:text-black transition-colors" />
        ),
        tooltip: "Expand All Quests",
        activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
        isActive: (mode: CursorModeType) => mode === "expand",
        handleToolClick: () => {
          toggleCollapseAll();
        },
      };

  // Add the AI generation tool

  const aiGenerationTool = {
    id: "ai-generate",
    icon: !isLoading ? (
      <Sparkles className="w-5 h-5 text-white group-hover:text-black transition-colors" />
    ) : (
      <Loader2 className="w-5 h-5 animate-spin text-white group-hover:text-black transition-colors" />
    ),
    tooltip: "AI Generate",
    activeColor: "bg-green-600 hover:bg-green-700 text-white",
    isActive: () => false,
    handleToolClick: () => {
      setOpenAiModal(true);
      // openAIGenerator();
    },
  };

  const allTools = [...tools, collapseExpandTool, aiGenerationTool];

  return (
    <div className="absolute top-6 right-6 z-20 rounded-xl shadow-lg border p-2 flex flex-col gap-1 bg-[rgba(15,10,40,0.85)] border-2 border-[rgba(59,130,246,0.4)] backdrop-blur-md">
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
