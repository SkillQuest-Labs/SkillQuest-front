import { type Node } from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { CircularSkillNode, QuestProgressStatus } from "../../skill-tree.type";
import { defineNodeProperties } from "./define-node-properties";
import { calculateNodePosition, countNodesPerLevel, sortQuestNodesByLevel } from "../skill-tree.const";

type GenerateCircularNodesDataProps = {
  nodes: Node<QuestNodeData>[] | Node<SkillNodeData>[];
  visitedLevels: Record<string, number>;
  graph: any;
  ringRadii: number[];
  centerX: number;
  centerY: number;
};

export const generateCircularNodesData = ({
  nodes,
  visitedLevels,
  graph,
  ringRadii,
  centerX,
  centerY,
}: GenerateCircularNodesDataProps) => {
  const circularSkillNodes: CircularSkillNode[] = [];
  const nodesPerLevel = countNodesPerLevel({ nodes, visitedLevels });
  const sortedQuestNodes = sortQuestNodesByLevel({ nodes, visitedLevels });

  const placedNodesCount: Record<number, number> = {};
  Object.keys(nodesPerLevel).forEach((level) => {
    placedNodesCount[Number(level)] = 0;
  });

  sortedQuestNodes.forEach((node) => {
    const level = visitedLevels[node.id] || 1;

    const currentCountPerLevel = placedNodesCount[level]++; // is a compteur
    const totalCountPerLevel = nodesPerLevel[level];

    const angleStep = (2 * Math.PI) / totalCountPerLevel; // angle between each node
    const finalAngle = currentCountPerLevel * angleStep;
    const radius = ringRadii[level];

    const { x, y } = calculateNodePosition({ centerX, centerY, radius, angle: finalAngle });

    const nodeVisualsProperties = defineNodeProperties({
      difficulty: node.data.difficulty,
      type: node.data.questType || "side",
      xp: node.data.xp,
    });

    const circularNode: CircularSkillNode = {
      id: node.id,
      title: node.data.title,
      description: node.data.description,
      position: { x, y },
      size: nodeVisualsProperties.size,
      shape: nodeVisualsProperties.shape,
      nodeType: nodeVisualsProperties.nodeType,
      status: node.data.status as QuestProgressStatus, // the status of the quests returned from the canvas needs to be corrected here
      isLocked: false,
      connections: graph.getDependents(node.id),
      prerequisites: graph.getPrerequisites(node.id),
      ring: level,
      angle: finalAngle,
      icon: nodeVisualsProperties.icon,
    };

    circularSkillNodes.push(circularNode);
    graph.addNode(circularNode);
  });

  return circularSkillNodes;
};
