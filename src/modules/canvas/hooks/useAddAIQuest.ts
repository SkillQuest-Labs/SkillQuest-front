import { useCallback } from "react";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useGenerateAIContent } from "./ai/useGenerateAIContent";
import { isSkillNode } from "../canvas.const";
import { useLoadingStore } from "@/stores/loading-store";
import { useSkillStore } from "@/stores/skill/skill-store";
import { createQuestNode } from "@/shared/utils/quetes/quest-node";
import { useQuestGenerationFormStore } from "@/stores/canvas/quest-generation-form-store";
import { MarkerType, type Edge } from "@xyflow/react";
import { calculateQuestGridLayout } from "@/shared/utils/canvas";

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
      setLoading(true);
      const quests = await generate();

      if (!Array.isArray(quests)) {
        throw new Error("Format de réponse invalide: attendu un tableau de quêtes");
      }

      if (quests.length === 0) {
        throw new Error("Aucune quête n'a pu être générée. Veuillez réessayer.");
      }

      const skillNode = currentNodes.find(isSkillNode);

      // Calculate positions for new quest nodes using grid layout
      const skillPosition = {
        x: skillNode ? skillNode.position.x : 400,
        y: skillNode ? skillNode.position.y : 50,
      };

      // Calculate all quest positions using the extracted layout function
      const questPositions = calculateQuestGridLayout({
        skillPosition,
        questCount: quests.length,
      });

      const questIds: string[] = [];

      quests.forEach((quest, index) => {
        const id = `quest-${crypto.randomUUID()}`;
        questIds.push(id);

        // Get position from calculated positions
        const position = questPositions[index];

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

      resetFormStore();
      if (skillNode?.id) {
        setCurrentSkillId(skillNode.id);
      }
    } catch (error) {
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
