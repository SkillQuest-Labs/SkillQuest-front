import type { QuestNodeData, SkillNodeData } from "./canvas.type";
import { type Node } from "@xyflow/react";

// export const skillConfigMockData = {
//   title: "JavaScript Fundamentals",
//   description: "Master the core concepts of JavaScript programming",
//   difficulty: "EASY",
//   status: "DRAFT",
//   color: "from-blue-500 to-indigo-600",
// };
// export const initialNodes: Node<SkillNodeData>[] = [
//   {
//     id: "skill-block",
//     type: "skill",
//     position: { x: 400, y: 50 },
//     data: {
//       kind: "skill",
//       config: skillConfigMockData,
//       // onUpdate: (field: string, value: any) =>
//       //   setSkillConfig((prev) => ({ ...prev, [field]: value })),
//     },
//     draggable: true,
//   },
// ];

// type guard to check if a node is a QuestNode or SkillNode
export const isQuestNode = (node: Node<QuestNodeData | SkillNodeData>): node is Node<QuestNodeData> =>
  node.data.kind === "quest";

export const isSkillNode = (node: Node<QuestNodeData | SkillNodeData>): node is Node<SkillNodeData> =>
  node.data.kind === "skill";
