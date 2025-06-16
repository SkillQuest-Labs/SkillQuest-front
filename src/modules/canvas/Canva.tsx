import { useState } from "react";
import type { CursorModeType, ViewModeType } from "./canva.type";
import { ReactFlow } from "@xyflow/react";
import { FloatingToolbox } from "./components/FloatingToolbox";

export const SkillsCanva = () => {
  const [cursorMode, setCursorMode] = useState<CursorModeType>("normal");
  const [viewMode, setViewMode] = useState<ViewModeType>("canvas");

  return (
    <div className="h-screen bg-gray-50 relative">
      <ReactFlow>
        {/* Mode Indicators */}
        {cursorMode === "create" && (
          <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
            ➕ Click anywhere to create a quest
          </div>
        )}

        {cursorMode === "connect" && (
          <div className="absolute top-4 left-4 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium z-10 animate-pulse">
            🔗 Click quests to connect them
            {/* {connectionStart && <span className="ml-2 text-purple-600">→ Select target quest</span>} */}
          </div>
        )}

        <FloatingToolbox
          cursorMode={cursorMode}
          setCursorMode={setCursorMode}
          setViewMode={setViewMode}
        />
      </ReactFlow>
    </div>
  );
};
