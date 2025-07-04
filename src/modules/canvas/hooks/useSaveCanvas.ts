import { type Node } from "@xyflow/react";

import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import { useCreateQuests, useGetQuests } from "@/shared/services/quest/api-quest";
import { useCallback, useEffect } from "react";
import { useCanvasStore } from "@/stores/quest/use-canvas-store";
import { initialNodes } from "../canvas.const";

export const useSaveCanvas = () => {
  const { createQuest } = useCreateQuests();
  const { nodes, newIds, modifiedNodesIds, clearFlags } = useCanvasStore();

  // type guard to check if a node is a QuestNode
  const isQuestNode = (node: Node<QuestNodeData | SkillNodeData>): node is Node<QuestNodeData> =>
    node.data.kind === "quest";

  const saveCanvas = async () => {
    // const skillId = nodes[0].type === "skill" ? nodes[0].id : undefined;

    const toCreate = nodes
      .filter(isQuestNode)
      .filter((node) => newIds.includes(node.id))
      .map((node) => ({
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
        skillId: "uuid-skill-1234-5678-9012-345678901234", // replace with actual skill ID
      }));

    const toUpdate = nodes
      .filter(isQuestNode)
      .filter((node) => modifiedNodesIds.includes(node.id) && !newIds.includes(node.id))
      .map((node) => ({
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
      }));

    try {
      if (toCreate.length > 0) {
        const response = await createQuest(toCreate);
        return response;
      }
      if (toUpdate.length > 0) {
        return "Update functionality not implemented yet";
      }

      clearFlags();
    } catch (error) {
      return error;
    }
  };

  return {
    saveCanvas,
  };
};

export const useQuestsLoader = (skillId: string) => {
  const { quests, loading, error } = useGetQuests(skillId);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const removeNode = useCanvasStore((state) => state.removeNode);
  const markModifiedNode = useCanvasStore((state) => state.markModifiedNode);

  const updateNodeData = useCallback(
    (id: string, field: string, value: any) => {
      const current = useCanvasStore.getState().nodes;
      const updated = current.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
      setNodes(updated);
      markModifiedNode(id);
    },
    [setNodes, markModifiedNode],
  );

  useEffect(() => {
    if (!quests) return;

    const questNodes: Node<QuestNodeData>[] = quests.map((quest) => ({
      id: quest.questId,
      type: "questNode",
      position: { x: quest.position.x, y: quest.position.y },
      data: {
        kind: "quest",
        title: quest.title,
        xp: quest.xp,
        difficulty: quest.difficulty,
        description: quest.description,
        status: quest.status,
        isCollapsed: false,
        onDelete: (nid: string) => removeNode(nid),
        onUpdate: (field: string, value: any) => updateNodeData(quest.questId, field, value),
      },
    }));

    setNodes([...initialNodes, ...questNodes]);
  }, [quests, setNodes, removeNode, updateNodeData]);

  return { quests, loading, error };
};
