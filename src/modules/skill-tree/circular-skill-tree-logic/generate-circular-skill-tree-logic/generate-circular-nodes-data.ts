import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { type Node } from "@xyflow/react";
import type { CircularSkillNode } from "../../skill-tree.type";
import { calculateNodePosition, countNodesPerLevel, sortQuestNodesByLevel } from "../skill-tree.const";
import { defineNodeProperties } from "./define-node-properties";
import type { DependencyGraph } from "./dependency-graph";

type GenerateCircularNodesDataProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  visitedLevels: Record<string, number>;
  graph: DependencyGraph;
  ringRadii: number[];
  centerX: number;
  centerY: number;
  totalQuestCount?: number;
};

export const generateCircularNodesData = ({
  nodes,
  visitedLevels,
  graph,
  ringRadii,
  centerX,
  centerY,
  totalQuestCount = 0,
}: GenerateCircularNodesDataProps) => {
  const circularSkillNodes: CircularSkillNode[] = [];
  const nodesPerLevel = countNodesPerLevel({ nodes, visitedLevels });
  const sortedQuestNodes = sortQuestNodesByLevel({ nodes, visitedLevels });

  // When the layout has an outer radius of ~600 and 6+ nodes,
  // each concentric ring carries a single node – upscale them globally.
  const boostAllRings = totalQuestCount >= 6 && ringRadii.some((radius) => radius >= 600);

  const placedNodesCount: Record<number, number> = {};
  Object.keys(nodesPerLevel).forEach((level) => {
    placedNodesCount[Number(level)] = 0;
  });

  sortedQuestNodes.forEach((node) => {
    const level = visitedLevels[node.id] || 1;

    const currentCountPerLevel = placedNodesCount[level]++;
    const totalCountPerLevel = nodesPerLevel[level];

    const angleStep = (2 * Math.PI) / totalCountPerLevel;
    let finalAngle = currentCountPerLevel * angleStep;

    // Add a slight random jitter to the angle to avoid perfect alignment
    const jitter = (Math.random() - 0.5) * (angleStep / 2); // Jitter is half the angle step
    finalAngle += jitter;

    // Avoid angles that are multiples of 90 degrees (0, π/2, π, 3π/2)
    if (Math.abs(finalAngle % (Math.PI / 2)) < 0.1) {
      finalAngle += 0.1; // Slightly adjust the angle
    }

    const radius = ringRadii[level];

    const { x, y } = calculateNodePosition({ centerX, centerY, radius, angle: finalAngle });

    const nodeVisualsProperties = defineNodeProperties({
      nodeKind: node.data.kind,
      xp: 0,
      status: node.data.status,
    });

    const adjustedSize = nodeVisualsProperties.size + (boostAllRings ? 28 : 0);

    const circularNode: CircularSkillNode = {
      id: node.id,
      title: node.data.title,
      description: node.data.description || "",
      position: { x, y },
      size: adjustedSize,
      shape: nodeVisualsProperties.shape,
      nodeType: nodeVisualsProperties.nodeType,
      status: node.data.status,
      isLocked: false,
      connections: graph.getDependents(node.id),
      prerequisites: graph.getPrerequisites(node.id),
      ring: level,
      angle: finalAngle,
      icon: nodeVisualsProperties.icon,
      questDetails: {
        type: node.data.questType,
        number: node.data.questNumber,
        isStarting: node.data.isStarting,
      },
    };

    circularSkillNodes.push(circularNode);
    graph.addNode(circularNode);
  });

  return circularSkillNodes;
};
