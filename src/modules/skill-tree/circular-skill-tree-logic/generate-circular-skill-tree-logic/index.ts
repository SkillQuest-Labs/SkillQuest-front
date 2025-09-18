import { isSkillNode } from "@/modules/canvas/canvas.const";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { type Edge, type Node } from "@xyflow/react";
import { buildDependencyGraph } from "../init/build-dependency-graph";
import { computeNodeLevels } from "./compute-node-levels";
import { findRootQuestIds } from "./find-root-quest-ids";
import { generateCircularNodesData } from "./generate-circular-nodes-data";
import { generateSpiralNodesData } from "./generate-spiral-nodes-data";

type GenerateCircularNodesDataProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  centerX: number;
  centerY: number;
  forceLayoutType?: "spiral" | "concentric";
};

export const generateCircularSkillTreeData = ({
  nodes,
  edges,
  centerX,
  centerY,
  forceLayoutType = "spiral",
}: GenerateCircularNodesDataProps) => {
  const graph = buildDependencyGraph(nodes, edges);
  const rootQuestIds = findRootQuestIds(nodes, edges, graph);

  // Add center node to graph and connect it to root quests (using skill node's actual ID)
  const skillNode = nodes.find(isSkillNode);
  if (skillNode) {
    const existingSkillNode = graph.getNode(skillNode.id);
    if (existingSkillNode) {
      existingSkillNode.position = { x: centerX, y: centerY };
      existingSkillNode.size = 50;
      existingSkillNode.shape = "circle";
      existingSkillNode.nodeType = "mastery";
      existingSkillNode.ring = 0;
      existingSkillNode.angle = 0;
      existingSkillNode.connections = rootQuestIds;
    } else {
      graph.addNode({
        id: skillNode.id, // Use actual skill ID, not "center"
        title: skillNode.data.config.title,
        description: skillNode.data.config.description || "",
        position: { x: centerX, y: centerY },
        size: 50,
        shape: "circle",
        nodeType: "mastery",
        status: "NOT_STARTED",
        isLocked: false,
        connections: rootQuestIds,
        prerequisites: [],
        ring: 0,
        angle: 0,
        icon: skillNode.data.config.icon,
      });
    }

    // Connect skill node to root quests (only if not already connected)
    rootQuestIds.forEach((rootId) => {
      const existingPrereqs = graph.getPrerequisites(rootId);
      if (!existingPrereqs.includes(skillNode.id)) {
        graph.addEdge(skillNode.id, rootId);
      }
    });
  }

  const { visitedLevels, maxLevel } = computeNodeLevels({ graph, rootQuestIds });

  // Compter le nombre total de quêtes (exclure le nœud de compétence)
  const questNodes = nodes.filter((node) => !isSkillNode(node));
  const totalQuestCount = questNodes.length;

  // Logique de sélection du layout basée sur la préférence utilisateur
  let circularSkillNodes: any[];

  if (forceLayoutType === "spiral") {
    // Utiliser le layout en spirale
    circularSkillNodes = generateSpiralNodesData({ nodes, visitedLevels, graph, centerX, centerY });
  } else {
    // Utiliser le layout en cercles concentriques
    const ringRadii = Array.from({ length: maxLevel + 1 }, (_, i) => i * 100);
    circularSkillNodes = generateCircularNodesData({
      nodes,
      visitedLevels,
      graph,
      ringRadii,
      centerX,
      centerY,
      totalQuestCount,
    });
  }

  // Now that all nodes are in the graph with their prerequisites, determine if each node is locked
  const skillNodeId = skillNode?.id;
  circularSkillNodes.forEach((node) => {
    if (node.id !== skillNodeId) {
      const isConnectedToSkill = skillNodeId && node.prerequisites.includes(skillNodeId);
      node.isLocked = !isConnectedToSkill;
      node.status = isConnectedToSkill ? "UNLOCKED" : "LOCKED";
      node.icon = isConnectedToSkill ? "🔓" : "🔒";
    }
  });

  if (skillNodeId) {
    const skillCircularNode = graph.getNode(skillNodeId);
    if (skillCircularNode) {
      // Add the central node at the beginning of the array
      circularSkillNodes.unshift(skillCircularNode);
    }
  }

  return { graph, circularSkillNodes };
};
