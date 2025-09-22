import type { CircularSkillNode } from "../../skill-tree.type";

export const nodeContent = (node: CircularSkillNode) => {
  const inner = node.icon || (node.isLocked ? "🔒" : "✦");

  return node.shape === "diamond" ? <div style={{ transform: "rotate(-45deg)" }}>{inner}</div> : inner;
};
