import type { SkillTreeNode } from "../../skill-tree.type";

export const nodeContent = (node: SkillTreeNode) => {
  const inner = node.icon || (node.isLocked ? "🔒" : "⚡");

  return node.shape === "diamond" ? <div style={{ transform: "rotate(-45deg)" }}>{inner}</div> : inner;
};
