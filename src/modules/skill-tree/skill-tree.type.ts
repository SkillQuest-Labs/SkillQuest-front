import { type Node } from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas/canvas.type";

export type NodeShape = "circle" | "square" | "diamond" | "hexagon";
export type SkillNodeType = "small" | "medium" | "large" | "keystone" | "mastery";
export type QuestProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export type Position = {
  x: number;
  y: number;
};

export type CircularSkillNode = {
  id: string;
  title: string;
  description: string;
  position: Position;
  size: number;
  shape: NodeShape;
  nodeType: SkillNodeType;
  status: QuestProgressStatus;
  isLocked: boolean;
  connections: string[]; // IDs of nodes this node connects to (its dependents)
  prerequisites: string[]; // IDs of nodes this node depends on
  ring: number; // Which ring/level from center
  angle: number; // Position in ring
  icon?: string;
};

export type SkillTreeOptions = {
  animationEnabled?: boolean;
};

export type CountNodesPerLevel = {
  nodes: Node<QuestNodeData>[] | Node<SkillNodeData>[];
  visitedLevels: Record<string, number>;
};

export type SortNodesPerLevel = CountNodesPerLevel;

export type CalculateNodePositionsProps = {
  centerX: number;
  centerY: number;
  radius: number;
  angle: number;
};
