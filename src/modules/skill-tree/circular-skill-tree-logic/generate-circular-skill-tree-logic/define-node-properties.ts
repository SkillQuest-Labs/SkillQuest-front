import type { QuestStatus } from "@/shared/types/quest.type";
import type { SkillStatus } from "@/shared/types/skill.type";
import type { NodeShape, SkillNodeType } from "../../skill-tree.type";

type DefineNodePropertiesArgs = {
  nodeKind: string;
  xp: number;
  status: QuestStatus | SkillStatus;
};

export const defineNodeProperties = ({
  nodeKind,
  status,
}: DefineNodePropertiesArgs): {
  nodeType: SkillNodeType;
  size: number;
  shape: NodeShape;
  icon: string;
  cost: number;
} => {
  if (nodeKind === "skill" && status === "NOT_STARTED") {
    return {
      nodeType: "keystone",
      size: 40,
      shape: "diamond",
      icon: "👑",
      cost: 3,
    };
  } else if (nodeKind === "quest" && status === "LOCKED") {
    return {
      nodeType: "large",
      size: 35,
      shape: "hexagon",
      icon: "🔒",
      cost: 2,
    };
  } else if (nodeKind === "quest" && status === "UNLOCKED") {
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
