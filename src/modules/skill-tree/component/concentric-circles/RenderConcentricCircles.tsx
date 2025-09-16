import type { CircularSkillNode, SkillTreeOptions } from "../../skill-tree.type";
import { ConcentricCirclesSVG } from "./ConcentricCirclesSVG";
import { RenderSpiralLayout } from "./RenderSpiralLayout";

type RenderConcentricCirclesProps = {
  skillnodes: CircularSkillNode[];
  centerX: number;
  centerY: number;
  options?: SkillTreeOptions;
  containerWidth: number;
  containerHeight: number;
};

export const RenderConcentricCircles = ({
  skillnodes,
  centerX,
  centerY,
  options,
  containerWidth,
  containerHeight,
}: RenderConcentricCirclesProps) => {
  // Vérifier si les nœuds ont des propriétés de spirale
  const hasSpiralNodes = skillnodes.some(node => node.spiralRadius !== undefined);
  
  if (hasSpiralNodes) {
    // Utiliser le nouveau layout en spirale
    return (
      <RenderSpiralLayout
        skillnodes={skillnodes}
        centerX={centerX}
        centerY={centerY}
        options={options}
        containerWidth={containerWidth}
        containerHeight={containerHeight}
      />
    );
  }
  
  // Fallback vers les cercles concentriques pour la compatibilité
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
