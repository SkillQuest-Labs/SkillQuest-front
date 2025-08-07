import type { Node, Edge } from "@xyflow/react";
import type { CircularSkillNode } from "../skill-tree.type";
import type { DependencyGraph } from "./dependency-graph";

export const findRootQuestIds = (nodes: Node<CircularSkillNode>[], edges: Edge[], graph: DependencyGraph): string[] => {
  const roots: string[] = [];

  edges
    .filter((e) => e.source === "skill-block")
    .forEach((e) => {
      roots.push(e.target);
    });

  if (roots.length === 0) {
    nodes
      .filter((n) => n.type === "quest")
      .forEach((node) => {
        if (graph.getPrerequisites(node.id).length === 0) {
          roots.push(node.id);
        }
      });
  }
  return roots;
};
