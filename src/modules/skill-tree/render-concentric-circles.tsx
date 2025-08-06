import { ConcentricCircles } from "./component/skill-tree/ConcentricCircles";
import type { SkillTreeOptions } from "./skill-tree.type";

type NodeShape = "circle" | "square" | "diamond" | "hexagon";
type SkillNodeType = "small" | "medium" | "large" | "keystone" | "mastery";
type ProgressStatus = "not-started" | "in-progress" | "completed";

type Position = {
  x: number;
  y: number;
};
interface CircularSkillNode {
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
}

type RenderConcentricCirclesProps = {
  skillnodes: CircularSkillNode[];
  centerX: number;
  centerY: number;
  options?: SkillTreeOptions;
};

export const renderConcentricCircles = ({
  centerX = 500,
  centerY = 400,
  options,
}: Omit<RenderConcentricCirclesProps, "skillnodes"> & { skillnodes?: CircularSkillNode[] }) => {
  // const maxRing = skillnodes.reduce((max, node) => Math.max(max, node.ring), 0);
  // const rings = Array.from({ length: maxRing + 1 }, (_, i) => (i + 1) * 100);

  const rings = [70, 140, 210, 280, 350];

  return <ConcentricCircles rings={rings} centerX={centerX} centerY={centerY} options={options} />;
};
