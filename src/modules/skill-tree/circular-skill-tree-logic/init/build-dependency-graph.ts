import type { Edge, Node } from "@xyflow/react";
import type { QuestProgressStatus } from "../../skill-tree.type";
import { DependencyGraph } from "../../layout-strategies/shared/dependency-graph";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { isQuestNode } from "@/modules/canvas/canvas.const";

// Add all quest nodes to the graph first with initial data

export const buildDependencyGraph = (nodes: Node<QuestNodeData | SkillNodeData>[], edges: Edge[]): DependencyGraph => {
  const graph = new DependencyGraph();

  nodes.filter(isQuestNode).forEach((node) => {
    graph.addNode({
      id: node.id,
      title: node.data.title,
      description: node.data.description,
      position: { x: 0, y: 0 },
      size: 0,
      shape: "circle",
      nodeType: "small",
      status: node.data.status as QuestProgressStatus,
      isLocked: false,
      connections: [],
      prerequisites: [],
      ring: 0,
      angle: 0,
      icon: "⚡",
    });
  });

  edges.forEach((edge) => {
    graph.addEdge(edge.source, edge.target);
  });

  return graph;
};
