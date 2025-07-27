import { useCallback } from "react";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useGenerateAIContent } from "./ai/useGenerateAIContent";
import { isSkillNode } from "../canvas.const";
import { useLoadingStore } from "@/stores/loading-store";
import { useSkillStore } from "@/stores/skill/skill-store";
import { createQuestNode } from "@/shared/utils/quetes/quest-node";

/**
 * Hook that generates quests via AI and adds them to the canvas.
 */
export const useAddAIQuests = () => {
  const { generate } = useGenerateAIContent();
  const setLoading = useLoadingStore((state) => state.setLoading);

  const {
    addNode,
    markNew,
    removeNode,
    setNodes: updateNodes,
    markModifiedNode,
    nodes: currentNodes,
  } = useCanvasStore.getState();
  const setCurrentSkillId = useSkillStore.getState().setCurrentSkillId;

  const addGeneratedQuests = useCallback(async () => {
    try {
      setLoading(true);
      const quests = await generate();
      if (!Array.isArray(quests) || quests.length === 0) return;

      const skillNode = currentNodes.find(isSkillNode);

      // Calculate base position for new quest nodes

      const skillX = skillNode ? skillNode.position.x : 400;
      const skillY = skillNode ? skillNode.position.y : 50;

      // Place quests starting from x = skillX - 100, y = skillY + 150
      const baseY = skillY + 370;
      const baseX = skillX - 320;
      const questSpacingX = 470;

      quests.forEach((quest, index) => {
        const id = `quest-${crypto.randomUUID()}`;
        const position = { x: baseX + index * questSpacingX, y: baseY };

        const handleUpdate = (field: string, value: any) => {
          const updated = useCanvasStore
            .getState()
            .nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
          updateNodes(updated);
          markModifiedNode(id);
        };

        const newNode = createQuestNode(id, position, removeNode, handleUpdate, quest);
        addNode(newNode);
        markNew(id);
        if (skillNode?.id) {
          setCurrentSkillId(skillNode.id);
        }
      });
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  }, [
    generate,
    currentNodes,
    setLoading,
    addNode,
    markNew,
    removeNode,
    updateNodes,
    markModifiedNode,
    setCurrentSkillId,
  ]);

  return { addGeneratedQuests };
};
