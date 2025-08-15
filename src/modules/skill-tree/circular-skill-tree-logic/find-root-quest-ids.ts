import type { Node, Edge } from "@xyflow/react";
import type { CircularSkillNode } from "../skill-tree.type";
import type { DependencyGraph } from "./dependency-graph";

//Identify Root Nodes (connected to skill-block or no prerequisites)
export const findRootQuestIds = (nodes: Node<CircularSkillNode>[], edges: Edge[], graph: DependencyGraph): string[] => {
  const roots: string[] = [];

  // collect all node ids that are directly connected to "skill-block".
  edges
    .filter((e) => e.source === "skill-block")
    .forEach((e) => {
      roots.push(e.target);
    });

  // If no quests are connected to skill-block, find quests with no prerequisites
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
