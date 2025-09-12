import { type Node } from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "../canvas/canvas.type";
import type { QuestStatus } from "@/shared/types/quest.type";
import type { SkillStatus } from "@/shared/types/skill.type";

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
  status: QuestStatus | SkillStatus;
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
  nodes: Node<QuestNodeData | SkillNodeData>[];
  visitedLevels: Record<string, number>;
};

export type SortNodesPerLevel = CountNodesPerLevel;

export type CalculateNodePositionsProps = {
  centerX: number;
  centerY: number;
  radius: number;
  angle: number;
};

export const LEVEL_COLORS: Record<number, { node: string; border: string; connection: string }> = {
  0: { node: "#312e81", border: "#818cf8", connection: "#4f46e5" }, // Indigo - Centre
  1: { node: "#065f46", border: "#34d399", connection: "#10b981" }, // Emerald - Niveau 1
  2: { node: "#1d4ed8", border: "#60a5fa", connection: "#3b82f6" }, // Blue - Niveau 2
  3: { node: "#9a3412", border: "#fb923c", connection: "#f97316" }, // Orange - Niveau 3
  4: { node: "#581c87", border: "#c084fc", connection: "#a855f7" }, // Purple - Niveau 4
  5: { node: "#854d0e", border: "#facc15", connection: "#eab308" }, // Amber - Niveau 5
  6: { node: "#be123c", border: "#f87171", connection: "#ef4444" }, // Red - Niveau 6
  7: { node: "#166534", border: "#4ade80", connection: "#22c55e" }, // Green - Niveau 7
  8: { node: "#7c2d12", border: "#fdba74", connection: "#fb923c" }, // Orange-800 - Niveau 8
};
