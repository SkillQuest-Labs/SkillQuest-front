import { useLoadingStore } from "@/stores/loading-store";
import { ChevronDown, ChevronsDownUp, ChevronUp, Loader2, Maximize2, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import type { CursorModeType, FloatingToolboxProps } from "../../canvas.type";
import { ToolButton } from "./ToolButton";
import { tools } from "./toolbox.const";

export const FloatingToolbox = ({
  cursorMode,
  setCursorMode,
  // setViewMode,
  collapseAll,
  expandAll,
  setOpenAiModal,
}: FloatingToolboxProps) => {
  const [areNodesCollapsed, setAreNodesCollapsed] = useState<boolean>(false);
  const [isToolboxCollapsed, setIsToolboxCollapsed] = useState<boolean>(false);
  const isLoading = useLoadingStore((state) => state.isLoading);

  const toggleToolboxCollapse = useCallback(() => {
    setIsToolboxCollapsed(!isToolboxCollapsed);
  }, [isToolboxCollapsed]);

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
        title: " Déplier toutes les quêtes",
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
        title: "Replier toutes les quêtes",
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
    title: "Générer des quêtes avec l'IA",
    isActive: () => false,
    handleToolClick: () => {
      setOpenAiModal(true);
    },
  };

  const allTools = [...tools, collapseExpandTool, aiGenerationTool];

  return (
    <div
      className={`absolute top-6 right-6 z-20 rounded-xl shadow-lg flex flex-col gap-1 bg-[rgba(15,10,40,0.85)] border-2 border-[rgba(59,130,246,0.4)] backdrop-blur-md transition-all duration-300 ease-in-out ${
        isToolboxCollapsed ? "w-14 p-1" : "w-auto p-2"
      }`}
    >
      <div
        className="flex flex-col pt-1 items-center cursor-pointer hover:scale-105 transition-transform duration-200 relative"
        onClick={toggleToolboxCollapse}
        title={isToolboxCollapsed ? "Cliquez pour déplier la toolbox" : "Cliquez pour replier la toolbox"}
      >
        <div className="relative">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400/20 via-purple-500/30 to-pink-500/20 border border-cyan-300/40 backdrop-blur-sm flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Animated rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-300/20 animate-ping" />
          <div className="absolute inset-[-1px] rounded-full border border-purple-300/10 animate-pulse" />
        </div>

        {/* Animated arrows - direction changes based on state */}
        <div className={`flex flex-col items-center ${isToolboxCollapsed ? "mt-1" : "mb-1 order-first"}`}>
          {isToolboxCollapsed ? (
            /* Arrows pointing down when collapsed */
            <>
              <ChevronDown className="w-3 h-3 text-cyan-400/70 animate-bounce" />
              <ChevronDown className="w-2 h-2 text-cyan-400/50 animate-bounce delay-150 -mt-1" />
            </>
          ) : (
            /* Arrows pointing up when expanded */
            <>
              <ChevronUp className="w-2 h-2 text-cyan-400/50 animate-bounce delay-150 -mb-1" />
              <ChevronUp className="w-3 h-3 text-cyan-400/70 animate-bounce" />
            </>
          )}
        </div>
      </div>

      {/* Collapsible content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isToolboxCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
        }`}
      >
        {isToolboxCollapsed ? null : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
