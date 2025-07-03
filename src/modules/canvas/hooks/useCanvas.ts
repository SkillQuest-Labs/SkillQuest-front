import { type Node } from "@xyflow/react";

import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import type { Quest } from "@/shared/types/quest.type";
import { useCreateQuests } from "@/shared/services/quest/api-quest";

export const useQuestsCreation = () => {
  const { createQuest } = useCreateQuests();

  const saveCanvas = async (nodes: Node<QuestNodeData | SkillNodeData>[]) => {
    const skillId = nodes[0].type === "skill" ? nodes[0].id : undefined;

    const isQuestNode = (node: Node<QuestNodeData | SkillNodeData>): node is Node<QuestNodeData> =>
      node.type === "quest1" && node.data.kind === "quest";

    if (skillId) {
      const newQuest: Quest[] = nodes.filter(isQuestNode).map((node) => ({
        id: node.id,
        questId: node.id,
        title: node.data.title,
        difficulty: node.data.difficulty,
        description: node.data.description,
        xp: node.data.xp,
        status: node.data.status,
        isSubSkill: false,
        completionTime: new Date().toISOString(),
        position: { x: node.position.x, y: node.position.y },
        skillId: "uuid-skill-1234-5678-9012-345678901234",
      }));

      try {
        if (newQuest.length > 0) {
          const response = await createQuest(newQuest);
          console.log("Quest created successfully:", response);
        }
      } catch (error) {
        console.error("Error creating quest:", error);
      }
    }
  };

  return {
    saveCanvas,
  };
};
