type NodeShape = "circle" | "square" | "diamond" | "hexagon";
type SkillNodeType = "small" | "medium" | "large" | "keystone" | "mastery";
type ProgressStatus = "not-started" | "in-progress" | "completed";

type Position = {
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
  status: ProgressStatus;
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
