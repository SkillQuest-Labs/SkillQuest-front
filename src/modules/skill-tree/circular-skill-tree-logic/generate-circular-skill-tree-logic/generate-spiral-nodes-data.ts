import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { type Node } from "@xyflow/react";
import type { CircularSkillNode } from "../../skill-tree.type";
import { sortQuestNodesByLevel } from "../skill-tree.const";
import { defineNodeProperties } from "./define-node-properties";
import type { DependencyGraph } from "./dependency-graph";

type GenerateSpiralNodesDataProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  visitedLevels: Record<string, number>;
  graph: DependencyGraph;
  centerX: number;
  centerY: number;
  spiralConfig?: {
    initialRadius: number;
    radiusIncrement: number;
    angleIncrement: number;
    compactness: number;
  };
};

type SpiralPosition = {
  x: number;
  y: number;
  angle: number;
  radius: number;
};

const calculateSpiralPosition = (
  nodeIndex: number,
  centerX: number,
  centerY: number,
  config: {
    initialRadius: number;
    radiusIncrement: number;
    angleIncrement: number;
    compactness: number;
  },
): SpiralPosition => {
  // Calcul de l'angle et du rayon pour une spirale d'Archimède
  const angle = nodeIndex * config.angleIncrement;
  const radius = config.initialRadius + (nodeIndex * config.radiusIncrement) / config.compactness;

  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;

  return { x, y, angle, radius };
};

const getOptimalSpiralConfig = (totalNodes: number) => {
  // Configuration adaptative basée sur le nombre de nœuds avec espacement amélioré
  const baseConfig = {
    initialRadius: 120, // Augmenté de 80 à 120
    radiusIncrement: 25, // Augmenté de 15 à 25
    angleIncrement: Math.PI / 4, // Réduit pour plus d'espacement angulaire
    compactness: 1.5, // Réduit pour moins de compacité
  };

  if (totalNodes <= 5) {
    return {
      ...baseConfig,
      initialRadius: 100, // Augmenté de 60 à 100
      radiusIncrement: 20, // Augmenté de 12 à 20
      angleIncrement: Math.PI / 3, // Meilleur espacement angulaire
    };
  } else if (totalNodes <= 10) {
    return {
      ...baseConfig,
      initialRadius: 110, // Augmenté de 70 à 110
      radiusIncrement: 22, // Augmenté de 13 à 22
      angleIncrement: Math.PI / 3.5, // Espacement angulaire optimisé
    };
  } else {
    return {
      ...baseConfig,
      initialRadius: 120, // Maintenu mais augmenté par rapport à l'original
      radiusIncrement: 18, // Augmenté de 10 à 18
      angleIncrement: Math.PI / 5, // Plus d'espacement pour les grandes spirales
      compactness: 1.2, // Moins compact pour plus d'espace
    };
  }
};

export const generateSpiralNodesData = ({
  nodes,
  visitedLevels,
  graph,
  centerX,
  centerY,
  spiralConfig,
}: GenerateSpiralNodesDataProps) => {
  const circularSkillNodes: CircularSkillNode[] = [];
  const sortedQuestNodes = sortQuestNodesByLevel({ nodes, visitedLevels });

  // Configuration de la spirale
  const config = spiralConfig || getOptimalSpiralConfig(sortedQuestNodes.length);

  sortedQuestNodes.forEach((node, index) => {
    const level = visitedLevels[node.id] || 1;

    // Calcul de la position en spirale
    const spiralPosition = calculateSpiralPosition(index, centerX, centerY, config);

    const nodeVisualsProperties = defineNodeProperties({
      nodeKind: node.data.kind,
      xp: 0,
      status: node.data.status,
    });

    const circularNode: CircularSkillNode = {
      id: node.id,
      title: node.data.title,
      description: node.data.description || "",
      position: { x: spiralPosition.x, y: spiralPosition.y },
      size: nodeVisualsProperties.size,
      shape: nodeVisualsProperties.shape,
      nodeType: nodeVisualsProperties.nodeType,
      status: node.data.status,
      isLocked: false,
      connections: graph.getDependents(node.id),
      prerequisites: graph.getPrerequisites(node.id),
      ring: level,
      angle: spiralPosition.angle,
      icon: nodeVisualsProperties.icon,
      // Propriétés spécifiques à la spirale
      spiralRadius: spiralPosition.radius,
      spiralIndex: index,
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

// Fonction utilitaire pour calculer les dimensions de la spirale
export const calculateSpiralBounds = (
  nodeCount: number,
  config?: {
    initialRadius: number;
    radiusIncrement: number;
    angleIncrement: number;
    compactness: number;
  },
) => {
  const spiralConfig = config || getOptimalSpiralConfig(nodeCount);
  const lastNodeIndex = nodeCount - 1;
  const maxRadius =
    spiralConfig.initialRadius + (lastNodeIndex * spiralConfig.radiusIncrement) / spiralConfig.compactness;

  return {
    width: maxRadius * 2 + 200, // Marge de sécurité augmentée
    height: maxRadius * 2 + 200,
    maxRadius,
  };
};
