import { Link, Plus, Target } from "lucide-react";
import type { CursorModeType, ViewModeType } from "../../canvas.type";

export type ToolBoxItem = {
  id: string;
  icon: React.ReactNode;
  tooltip: string;
  activeColor: string;
  title?: string;
  isActive: (mode: CursorModeType) => boolean;
  handleToolClick: (
    setCursorMode: (mode: CursorModeType) => void,
    current: CursorModeType,
    context?: {
      openAIGenerator?: () => void;
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
    icon: <Plus className="w-5 h-5 text-white group-hover:text-black transition-colors" />,
    tooltip: "Create Quest",
    activeColor: "bg-blue-600 hover:bg-blue-700 text-white",
    title: "Ajoutez une nouvelle quête",
    isActive: (mode) => mode === "create",
    handleToolClick: (setCursorMode, current) => setCursorMode(current === "create" ? "normal" : "create"),
  },
  {
    id: "connect",
    icon: <Link className="w-5 h-5 text-white group-hover:text-black transition-colors" />,
    tooltip: "Link Quests",
    activeColor: "bg-purple-600 hover:bg-purple-700 text-white",
    title: "Liez des quêtes entre elles",
    isActive: (mode) => mode === "connect",
    handleToolClick: (setCursorMode, current) => setCursorMode(current === "connect" ? "normal" : "connect"),
  },
  {
    id: "select",
    icon: <Target className="w-5 h-5 text-white group-hover:text-black transition-colors" />,
    tooltip: "Select Mode",
    activeColor: "bg-gray-600 hover:bg-gray-700 text-white",
    title: "Sélect",
    isActive: (mode) => mode === "normal",
    handleToolClick: (setCursorMode) => setCursorMode("normal"),
  },

  // {
  //   id: "roadmap",
  //   icon: <Map className="w-5 h-5" color="white" />,
  //   tooltip: "Generate Roadmap",
  //   activeColor: "bg-green-600 hover:bg-green-700 text-white",
  //   isActive: () => false, // Always inactive, handled separately
  //   handleToolClick: (setCursorMode, _, ctx) => {
  //     ctx?.setViewMode?.("timeline");
  //     setCursorMode("normal");
  //   },
  // },
];
