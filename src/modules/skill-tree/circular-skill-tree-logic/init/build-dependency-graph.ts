import type { Edge, Node } from "@xyflow/react";
import type { CircularSkillNode } from "../../skill-tree.type";
import { DependencyGraph } from "../dependency-graph";

// Add all quest nodes to the graph first with initial data

export const buildDependencyGraph = (nodes: Node<CircularSkillNode>[], edges: Edge[]): DependencyGraph => {
  const graph = new DependencyGraph();

  nodes
    .filter((n) => n.type === "quest")
    .forEach((node) => {
      graph.addNode({
        id: node.id,
        title: node.data.title,
        description: node.data.description,
        position: { x: 0, y: 0 },
        size: 0,
        shape: "circle",
        nodeType: "small",
        status: node.data.status,
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
