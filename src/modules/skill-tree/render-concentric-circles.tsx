import { ConcentricCircles } from "./component/skill-tree/ConcentricCircles";
import type { CircularSkillNode, SkillTreeOptions } from "./skill-tree.type";

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
