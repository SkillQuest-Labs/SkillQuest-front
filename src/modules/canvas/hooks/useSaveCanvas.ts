import { MarkerType, type Node } from "@xyflow/react";

import type { QuestNodeData, SkillNodeData } from "../canvas.type";
import {
  useCreateQuests,
  useDeleteQuestRelations,
  useDeleteQuests,
  useGetQuests,
  useSaveQuestRelations,
  useUpdateQuests,
} from "@/shared/services/quest/api-quest";
import { useCallback, useEffect } from "react";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { isQuestNode, isSkillNode } from "../canvas.const";
import { showToast } from "@/component/notification/show-toast";
import { useCreateSkill, useGetSkill } from "@/shared/services/skill/api-skill";
import { useSearchParams } from "react-router-dom";
import { useSkillStore } from "@/stores/skill/skill-store";
import { useLoadingStore } from "@/stores/loading-store";

export const useSaveCanvas = () => {
  const { createQuest, error: createQuestError } = useCreateQuests();
  const { updateQuest, error: updateQuestError } = useUpdateQuests();
  const { deleteQuest, error: deleteQuestError } = useDeleteQuests();
  const { createSkill, error: createSkillError } = useCreateSkill();
  const { saveQuestRelations, error: questRelationError } = useSaveQuestRelations();
  const { deleteQuestRelations, error: deleteQuestRelationsError } = useDeleteQuestRelations();
  const { nodes, edges, newNodeIds, newEdgeIds, modifiedNodesIds, deletedNodesIds, deletedEdgeIds, clearFlags } =
    useCanvasStore();
  const [searchParams] = useSearchParams();
  const currentSkillId = useSkillStore((state) => state.currentSkillId);

  const saveCanvas = async () => {
    const searchSkillId = searchParams.get("skillId");
    const skillNode = nodes.find(isSkillNode);
    const skillId = currentSkillId ?? searchSkillId ?? "";

    const getConnectionCount = (nodeId: string) =>
      edges.filter((edge) => edge.source === nodeId || edge.target === nodeId).length;

    const toCreateQuest = nodes
      .filter(isQuestNode)
      .filter((node) => newNodeIds.includes(node.id))
      .map((node) => ({
        id: node.id,
        questId: node.id,
        title: node.data.title || "New Quest",
        description: node.data.description,
        status: node.data.status,
        isSubSkill: false,
        completionTime: new Date().toISOString(),
        position: { x: node.position.x, y: node.position.y },
        connectionCount: getConnectionCount(node.id),
        skillId,
      }));

    const toCreateSkill = skillNode &&
      newNodeIds.includes(skillNode.id) && {
        id: skillNode.id,
        skillId: skillNode.id,
        title: skillNode.data.config.title || "New Skill",
        description: skillNode.data.config.description,
        status: skillNode.data.config.status,
        difficulty: skillNode.data.config.difficulty,
        // position: { x: skillNode.position.x, y: skillNode.position.y },
        userId: "uuid-user-1234-5678-9012-345678901234",
      };

    const toCreateEdge = edges
      .filter((edge) => newEdgeIds.includes(edge.id))
      .map((edge) => ({
        questRelationId: edge.id,
        ...(edge.source === currentSkillId ? { parentSkillId: edge.source } : { parentQuestId: edge.source }),
        childQuestId: edge.target,
      }));

    const toUpdateQuest = nodes
      .filter(isQuestNode)
      .filter((node) => modifiedNodesIds.includes(node.id) && !newNodeIds.includes(node.id))
      .map((node) => ({
        id: node.id,
        questId: node.id,
        title: node.data.title || "New Quest",
        description: node.data.description,
        status: node.data.status,
        isSubSkill: false,
        completionTime: new Date().toISOString(),
        position: { x: node.position.x, y: node.position.y },
        connectionCount: getConnectionCount(node.id),
      }));

    const toDeleteQuest = deletedNodesIds
      .filter((deletedId) => !newNodeIds.includes(deletedId))
      .map((deletedId) => ({
        id: deletedId,
        questId: deletedId,
      }));

    const toDeleteEdges = deletedEdgeIds
      .filter((deletedId) => !newEdgeIds.includes(deletedId))
      .map((questRelationId) => ({ questRelationId }));

    try {
      if (toCreateSkill) {
        await createSkill(toCreateSkill);
      }
      if (toCreateQuest.length > 0 && currentSkillId && currentSkillId !== "") {
        await createQuest(toCreateQuest);
      }
      if (toUpdateQuest.length > 0) {
        await updateQuest(toUpdateQuest);
      }
      if (toDeleteQuest.length > 0) {
        await deleteQuest(toDeleteQuest);
      }
      if (toCreateEdge.length > 0) {
        await saveQuestRelations(toCreateEdge);
      }
      if (toDeleteEdges.length > 0) {
        await deleteQuestRelations(toDeleteEdges);
      }

      clearFlags();
    } catch {
      if (
        createQuestError ||
        updateQuestError ||
        deleteQuestError ||
        createSkillError ||
        questRelationError ||
        deleteQuestRelationsError
      ) {
        showToast({
          status: "error",
          title: "Failed to save canvas. Please try again.",
        });
      }
    }
  };

  return {
    saveCanvas,
  };
};

export const useCanvasLoader = () => {
  const [searchParams] = useSearchParams();
  const { setLoading } = useLoadingStore();

  const skillId = searchParams.get("skillId");

  const { quests, questRelations, loading: questsLoading } = useGetQuests(skillId ?? "");
  const { skill, loading: skillLoading } = useGetSkill(skillId ?? "");

  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const addNode = useCanvasStore((state) => state.addNode);
  const removeNode = useCanvasStore((state) => state.removeNode);
  const markModifiedNode = useCanvasStore((state) => state.markModifiedNode);
  const setCurrentSkillId = useSkillStore((state) => state.setCurrentSkillId);

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
    const isLoading = questsLoading || skillLoading;
    setLoading(isLoading, "overlay");
  }, [questsLoading, skillLoading, setLoading]);

  useEffect(() => {
    if (!quests || !skill || !questRelations) return;

    const questNodes: Node<QuestNodeData>[] = quests.map((quest) => ({
      id: quest.questId,
      type: "questNode",
      position: { x: quest.position.x, y: quest.position.y },
      data: {
        kind: "quest",
        title: quest.title,
        description: quest.description,
        status: quest.status,
        isCollapsed: false,
        onDelete: (nid: string) => removeNode(nid),
        onUpdate: (field: string, value: any) => updateNodeData(quest.questId, field, value),
      },
    }));

    const questEdges = questRelations?.map((r) => ({
      id: r.questRelationId ?? `edge_${r.parentQuestId}_${r.childQuestId}`,
      source: r.parentQuestId ?? r.parentSkillId ?? "",
      target: r.childQuestId,
      type: "custom",
      animated: true,
      style: { stroke: "#fde68a", strokeWidth: 3 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#6366f1",
      },
    }));

    const skillNode: Node<SkillNodeData> = {
      id: skill.skillId ?? "",
      type: "skill",
      position: { x: 400, y: 50 },
      data: {
        kind: "skill",
        config: {
          title: skill.title ?? "",
          description: skill.description ?? "",
          difficulty: skill.difficulty,
          status: skill.status,
          color: "from-blue-500 to-indigo-600",
        },
      },
    };
    setEdges(questEdges);
    setNodes([...questNodes, skillNode]);
    setCurrentSkillId(skillNode.id);
  }, [skill, quests, questRelations, setNodes, setEdges, addNode, removeNode, updateNodeData, setCurrentSkillId]);
};
