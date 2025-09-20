import type { CircularSkillNode, SkillTreeOptions } from "../../skill-tree.type";
import { SpiralSVG } from "./SpiralSVG";

type RenderSpiralLayoutProps = {
  skillnodes: CircularSkillNode[];
  centerX: number;
  centerY: number;
  options?: SkillTreeOptions;
  containerWidth: number;
  containerHeight: number;
};

export const RenderSpiralLayout = ({
  skillnodes,
  centerX,
  centerY,
  options,
  containerWidth,
  containerHeight,
}: RenderSpiralLayoutProps) => {
  // Calculer les propriétés de la spirale basées sur les nœuds
  const spiralNodes = skillnodes.filter((node) => node.spiralRadius !== undefined);
  const maxRadius = spiralNodes.reduce((max, node) => Math.max(max, node.spiralRadius || 0), 0);

  // Créer les points de la spirale pour le tracé
  const spiralPoints = spiralNodes
    .sort((a, b) => (a.spiralIndex || 0) - (b.spiralIndex || 0))
    .map((node) => ({
      x: node.position.x,
      y: node.position.y,
      radius: node.spiralRadius || 0,
      angle: node.angle,
      index: node.spiralIndex || 0,
    }));

  return (
    <SpiralSVG
      spiralPoints={spiralPoints}
      maxRadius={maxRadius}
      centerX={centerX}
      centerY={centerY}
      options={options}
      containerWidth={containerWidth}
      containerHeight={containerHeight}
    />
  );
};
