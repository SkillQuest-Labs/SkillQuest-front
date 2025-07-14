import type { SkillNodeData } from "./canvas.type";
import { type Node } from "@xyflow/react";

export const skillConfigMockData = {
  // we get the real data from the config modal
  title: "JavaScript Fundamentals",
  description: "Master the core concepts of JavaScript programming",
  icon: "💻",
  color: "from-blue-500 to-indigo-600",
};

// Initialize skill block
export const initialNodes: Node<SkillNodeData>[] = [];
