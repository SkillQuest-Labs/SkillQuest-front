import type { CircularSkillNode, SkillTreeOptions } from "../../skill-tree.type";
import { ConcentricCirclesSVG } from "./ConcentricCirclesSVG";

type RenderConcentricCirclesProps = {
  skillnodes: CircularSkillNode[];
  centerX: number;
  centerY: number;
  options?: SkillTreeOptions;
  containerWidth: number;
  containerHeight: number;
};

export const renderConcentricCircles = ({
  skillnodes,
  centerX,
  centerY,
  options,
  containerWidth,
  containerHeight,
}: RenderConcentricCirclesProps) => {
  const maxRing = skillnodes.reduce((max, node) => Math.max(max, node.ring), 0);
  const rings = Array.from({ length: maxRing }, (_, i) => (i + 1) * 100);

  return (
    <ConcentricCirclesSVG
      rings={rings}
      centerX={centerX}
      centerY={centerY}
      options={options}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
    />
  );
};
