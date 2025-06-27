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
export const initialNodes: Node<SkillNodeData>[] = [
  {
    id: "skill-block",
    type: "skill",
    position: { x: 400, y: 50 },
    data: {
      config: skillConfigMockData,
      // onUpdate: (field: string, value: any) =>
      //   setSkillConfig((prev) => ({ ...prev, [field]: value })),
    },
    draggable: true,
  },
];
