import { useCallback } from "react";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useGenerateAIContent } from "./ai/useGenerateAIContent";
import { isSkillNode } from "../canvas.const";
import { useLoadingStore } from "@/stores/loading-store";
import { useSkillStore } from "@/stores/skill/skill-store";
import { createQuestNode } from "@/shared/utils/quetes/quest-node";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";
import { MarkerType, type Edge } from "@xyflow/react";

/**
 * Hook that generates quests via AI and adds them to the canvas.
 */
export const useAddAIQuests = () => {
  const { generate } = useGenerateAIContent();
  const setLoading = useLoadingStore((state) => state.setLoading);
  const resetFormStore = useQuestGenerationFormStore((state) => state.resetFormStore);
  const {
    addNode,
    markNodeNew,
    removeNode,
    setNodes: updateNodes,
    markModifiedNode,
    nodes: currentNodes,
    edges: currentEdges,
    setEdges,
    markNewEdge,
  } = useCanvasStore.getState();
  const setCurrentSkillId = useSkillStore.getState().setCurrentSkillId;

  const addGeneratedQuests = useCallback(async () => {
    try {
      console.log("🚀 [useAddAIQuest] Début de la génération de quêtes IA");
      setLoading(true);
      const quests = await generate();

      if (!Array.isArray(quests)) {
        console.error("❌ [useAddAIQuest] La réponse n'est pas un tableau:", typeof quests, quests);
        throw new Error("Format de réponse invalide: attendu un tableau de quêtes");
      }

      if (quests.length === 0) {
        console.warn("⚠️ [useAddAIQuest] Aucune quête générée");
        throw new Error("Aucune quête n'a pu être générée. Veuillez réessayer.");
      }

      console.log(`✅ [useAddAIQuest] ${quests.length} quête(s) générée(s) avec succès`);

      const skillNode = currentNodes.find(isSkillNode);

      // Calculate base position for new quest nodes with grid layout (vertical/horizontal groups)
      const skillX = skillNode ? skillNode.position.x : 400;
      const skillY = skillNode ? skillNode.position.y : 50;

      // Grid layout configuration
      const baseY = skillY + 350;
      const baseX = skillX - 200;
      const questSpacingY = 525; // Vertical spacing between quests
      const questSpacingX = 400; // Horizontal spacing between quests
      const groupSpacingX = 800; // Spacing between groups
      const questsPerGroup = 3;
      const questIds: string[] = [];

      quests.forEach((quest, index) => {
        const id = `quest-${crypto.randomUUID()}`;
        questIds.push(id);

        // Determine group and position within group
        const groupIndex = Math.floor(index / questsPerGroup);
        const positionInGroup = index % questsPerGroup;
        const isVerticalGroup = groupIndex % 2 === 0; // Odd groups (1st, 3rd, 5th...) are vertical

        let position;
        if (isVerticalGroup) {
          // Vertical group: stack quests vertically
          position = {
            x: baseX + groupIndex * groupSpacingX,
            y: baseY + positionInGroup * questSpacingY,
          };
        } else {
          // Horizontal group: arrange quests horizontally
          position = {
            x: baseX + groupIndex * groupSpacingX + positionInGroup * questSpacingX,
            y: baseY,
          };
        }

        const handleUpdate = (field: string, value: any) => {
          const updated = useCanvasStore
            .getState()
            .nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
          updateNodes(updated);
          markModifiedNode(id);
        };

        const newNode = createQuestNode(id, position, removeNode, handleUpdate, quest);
        addNode(newNode);
        markNodeNew(id);
      });

      // Create automatic connections between quests and skill node
      const newEdges: Edge[] = [];

      questIds.forEach((questId, index) => {
        if (index === 0 && skillNode?.id) {
          // Connect first quest to skill node
          const edgeId = `edge_${skillNode.id}_${questId}`;
          const newEdge: Edge = {
            id: edgeId,
            source: skillNode.id,
            target: questId,
            type: "custom",
            animated: true,
            style: { stroke: "#fde68a", strokeWidth: 3 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#6366f1",
            },
          };
          newEdges.push(newEdge);
          markNewEdge(edgeId);
        }

        if (index > 0) {
          // Connect each quest to the previous one
          const previousQuestId = questIds[index - 1];
          const edgeId = `edge_${previousQuestId}_${questId}`;
          const newEdge: Edge = {
            id: edgeId,
            source: previousQuestId,
            target: questId,
            type: "custom",
            animated: true,
            style: { stroke: "#fde68a", strokeWidth: 3 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#6366f1",
            },
          };
          newEdges.push(newEdge);
          markNewEdge(edgeId);
        }
      });

      // Update edges in the store
      setEdges([...currentEdges, ...newEdges]);

      console.log("quests", quests);

      resetFormStore();
      if (skillNode?.id) {
        setCurrentSkillId(skillNode.id);
      }
    } catch (error) {
      console.error("❌ [useAddAIQuest] Erreur lors de la génération de quêtes:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      // Rethrow l'erreur pour que le composant parent puisse l'afficher à l'utilisateur
      throw new Error(
        error instanceof Error
          ? `Échec de la génération de quêtes: ${error.message}`
          : "Une erreur inattendue s'est produite lors de la génération de quêtes",
      );
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    generate,
    currentNodes,
    setEdges,
    currentEdges,
    resetFormStore,
    removeNode,
    addNode,
    markNodeNew,
    updateNodes,
    markModifiedNode,
    markNewEdge,
    setCurrentSkillId,
  ]);

  return { addGeneratedQuests };
};
