import type { NodeShape, SkillNodeType } from "../../skill-tree.type";

type DefineNodePropertiesArgs = {
  xp: number;
  difficulty: string | undefined;
  type: string;
};

export const defineNodeProperties = ({
  xp,
  difficulty,
  type,
}: DefineNodePropertiesArgs): {
  nodeType: SkillNodeType;
  size: number;
  shape: NodeShape;
  icon: string;
  cost: number;
} => {
  if (difficulty === "Hard" || type === "main") {
    return {
      nodeType: "keystone",
      size: 40,
      shape: "hexagon",
      icon: "👑",
      cost: 3,
    };
  } else if (xp >= 200) {
    return {
      nodeType: "large",
      size: 35,
      shape: "diamond",
      icon: "💎",
      cost: 2,
    };
  } else if (xp >= 100) {
    return {
      nodeType: "medium",
      size: 30,
      shape: "square",
      icon: "✨",
      cost: 1,
    };
  }

  return {
    nodeType: "small",
    size: 25,
    shape: "circle",
    icon: "⚡",
    cost: 1,
  };
};
