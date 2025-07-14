import { useSkillStore } from "@/stores/skill/skillStore";
import type { SkillNodeData } from "./canvas.type";
import { type Node } from "@xyflow/react";

export const initialNodes = (): Node<SkillNodeData> => {
  const skill = useSkillStore.getState().skill;

  return {
    id: `skill-${skill.id || "block"}`,
    type: "skill",
    position: { x: 400, y: 50 },
    data: {
      kind: "skill",
      config: { ...skill },
    },
    draggable: true,
  };
};
