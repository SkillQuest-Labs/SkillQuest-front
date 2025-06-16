import { Button } from "@/shared/components/ui/button";
import { Link, MinusSquare, Plus, PlusSquare, Target, Map } from "lucide-react";
import type { FloatingToolboxProps } from "../canva.type";

export const FloatingToolbox = ({
  cursorMode,
  setCursorMode,
  setViewMode,
}: FloatingToolboxProps) => (
  <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-2 flex flex-col gap-1">
    {/* Quest Creation Tool */}
    <div className="group relative">
      <Button
        onClick={() =>
          setCursorMode(cursorMode === "create" ? "normal" : "create")
        }
        variant={cursorMode === "create" ? "default" : "ghost"}
        size="sm"
        className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
          cursorMode === "create"
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            : "hover:bg-gray-100"
        }`}
      >
        <Plus className="w-5 h-5" />
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {cursorMode === "create" ? "Exit Create Mode" : "Create Quest"}
      </div>
    </div>

    {/* Link Mode Tool */}
    <div className="group relative">
      <Button
        onClick={() =>
          setCursorMode(cursorMode === "connect" ? "normal" : "connect")
        }
        variant={cursorMode === "connect" ? "default" : "ghost"}
        size="sm"
        className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
          cursorMode === "connect"
            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
            : "hover:bg-gray-100"
        }`}
      >
        <Link className="w-5 h-5" />
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {cursorMode === "connect" ? "Exit Link Mode" : "Link Quests"}
      </div>
    </div>

    {/* Select Mode Tool */}
    <div className="group relative">
      <Button
        onClick={() => setCursorMode("normal")}
        variant={cursorMode === "normal" ? "default" : "ghost"}
        size="sm"
        className={`w-10 h-10 p-0 rounded-lg transition-all duration-200 ${
          cursorMode === "normal"
            ? "bg-gray-600 hover:bg-gray-700 text-white shadow-md"
            : "hover:bg-gray-100"
        }`}
      >
        <Target className="w-5 h-5" />
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Select Mode
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-gray-200 my-1" />

    {/* Collapse/Expand quest Tools */}
    <div className="group relative">
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <MinusSquare className="w-5 h-5" />
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Collapse All
      </div>
    </div>

    <div className="group relative">
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-lg hover:bg-gray-100 transition-all duration-200"
      >
        <PlusSquare className="w-5 h-5" />
      </Button>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Expand All
      </div>
    </div>

    {/* Divider */}
    <div className="h-px bg-gray-200 my-1" />

    {/* Generate Roadmap Tool */}
    <div className="group relative">
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
    </div>
  </div>
);
