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
  }

  if (nodeKind === "quest") {
    if (status === "LOCKED") {
      return {
        nodeType: "large",
        size: 35,
        shape: "hexagon",
        icon: "🔒",
        cost: 2,
      };
    }

    if (status === "COMPLETED") {
      return {
        nodeType: "medium",
        size: 32,
        shape: "hexagon",
        icon: "✔",
        cost: 1,
      };
    }

    if (status === "IN_PROGRESS") {
      return {
        nodeType: "medium",
        size: 30,
        shape: "hexagon",
        icon: "⏳",
        cost: 1,
      };
    }

    if (status === "UNLOCKED" || status === "NOT_STARTED") {
      return {
        nodeType: "medium",
        size: 30,
        shape: "hexagon",
        icon: "✦",
        cost: 1,
      };
    }
  }

  return {
    nodeType: "small",
    size: 25,
    shape: "circle",
    icon: "⚡",
    cost: 1,
  };
};
