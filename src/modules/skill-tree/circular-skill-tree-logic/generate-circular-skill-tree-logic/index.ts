import { isSkillNode } from "@/modules/canvas/canvas.const";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { type Edge, type Node } from "@xyflow/react";
import { buildDependencyGraph } from "../init/build-dependency-graph";
import { computeNodeLevels } from "./compute-node-levels";
import { findRootQuestIds } from "./find-root-quest-ids";
import { generateCircularNodesData } from "./generate-circular-nodes-data";

type GenerateCircularNodesDataProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  centerX: number;
  centerY: number;
};

export const generateCircularSkillTreeData = ({ nodes, edges, centerX, centerY }: GenerateCircularNodesDataProps) => {
  //   const circularSkillNodes: CircularSkillNode[] = [];

  const graph = buildDependencyGraph(nodes, edges);
  const rootQuestIds = findRootQuestIds(nodes, edges, graph);

  // Add "center" node to graph and connect it to root quests (skill node)
  nodes.filter(isSkillNode).forEach((node) => {
    graph.addNode({
      id: "center",
      title: node.data.config.title,
      description: node.data.config.description || "",
      position: { x: centerX, y: centerY },
      size: 50,
      shape: "circle",
      nodeType: "mastery",
      status: "IN_PROGRESS",
      isLocked: false,
      connections: rootQuestIds, // Store direct dependents for the center node
      prerequisites: [],
      ring: 0,
      angle: 0,
      icon: node.data.config.icon,
    });
  });
  rootQuestIds.forEach((rootId) => {
    graph.addEdge("center", rootId);
  });

  const { visitedLevels, maxLevel } = computeNodeLevels({ graph, rootQuestIds });

  //  Radii for rings 0 to maxLevel
  const ringRadii = Array.from({ length: maxLevel + 1 }, (_, i) => i * 100);

  const circularSkillNodes = generateCircularNodesData({ nodes, visitedLevels, graph, ringRadii, centerX, centerY });

  // Now that all nodes are in the graph with their prerequisites, determine if each node is locked
  circularSkillNodes.forEach((node) => {
    if (node.id !== "center") {
    const isConnectedToCenter = node.prerequisites.includes("center");
    node.isLocked = !isConnectedToCenter;
    }
  });

  // Add the central node at the beginning of the array
  circularSkillNodes.unshift(graph.getNode("center"));

  return { graph, circularSkillNodes };
};
