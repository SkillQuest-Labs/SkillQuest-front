import { Link, Plus, Target, Map, ChevronsDownUp, Maximize2 } from "lucide-react";
import type { CursorModeType, ViewModeType } from "../../canvas.type";

export type ToolBoxItem = {
  id: string;
  icon: React.ReactNode;
  tooltip: string;
  activeColor: string;
  isActive: (mode: CursorModeType) => boolean;
  handleToolClick: (
    setCursorMode: (mode: CursorModeType) => void,
    current: CursorModeType,
    context?: {
      collapseAll?: () => void;
      expandAll?: () => void;
      setViewMode?: (mode: ViewModeType) => void;
    },
  ) => void;
};

export type ToolboxList = ToolBoxItem[];

export const tools: ToolboxList = [
  {
    id: "create",
    icon: <Plus className="w-5 h-5" />,
    tooltip: "Create Quest",
    activeColor: "bg-blue-600 hover:bg-blue-700 text-white",
    isActive: (mode) => mode === "create",
    handleToolClick: (setCursorMode, current) => setCursorMode(current === "create" ? "normal" : "create"),
  },
  {
    id: "connect",
    icon: <Link className="w-5 h-5" />,
    tooltip: "Link Quests",
    activeColor: "bg-purple-600 hover:bg-purple-700 text-white",
    isActive: (mode) => mode === "connect",
    handleToolClick: (setCursorMode, current) => setCursorMode(current === "connect" ? "normal" : "connect"),
  },
  {
    id: "select",
    icon: <Target className="w-5 h-5" />,
    tooltip: "Select Mode",
    activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
    isActive: (mode) => mode === "normal",
    handleToolClick: (setCursorMode) => setCursorMode("normal"),
  },
  {
    id: "collapse",
    icon: <ChevronsDownUp className="w-5 h-5" />,
    tooltip: "Collapse All Quests",
    activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
    isActive: (mode) => mode === "collapse",
    handleToolClick: (setCursorMode, current, ctx) => {
      ctx?.collapseAll?.();
      setCursorMode(current === "collapse" ? "normal" : "collapse");
    },
  },
  {
    id: "expand",
    icon: <Maximize2 className="w-5 h-5 transform rotate-180" />,
    tooltip: "Expand All Quests",
    activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
    isActive: (mode) => mode === "expand",
    handleToolClick: (setCursorMode, current, ctx) => {
      ctx?.expandAll?.();
      setCursorMode(current === "expand" ? "normal" : "expand");
    },
  },
  {
    id: "roadmap",
    icon: <Map className="w-5 h-5" />,
    tooltip: "Generate Roadmap",
    activeColor: "bg-green-600 hover:bg-green-700 text-white",
    isActive: () => false, // Always inactive, handled separately
    handleToolClick: (setCursorMode, _, ctx) => {
      ctx?.setViewMode?.("timeline");
      setCursorMode("normal");
    },
  },
];
