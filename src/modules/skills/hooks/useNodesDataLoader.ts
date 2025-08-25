import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { useGetQuests } from "@/shared/services/quest/api-quest";
import { useGetSkill } from "@/shared/services/skill/api-skill";
import { MarkerType, type Edge, type Node } from "@xyflow/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useNodesDataLoader = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const [nodesData, setNodesData] = useState<Node<QuestNodeData | SkillNodeData>[]>();
  const [edgesData, setEdgesData] = useState<Edge[]>();

  const { quests, questRelations } = useGetQuests(skillId ?? "");
  const { skill } = useGetSkill(skillId ?? "");

  useEffect(() => {
    if (!quests || !skill) return;

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

    setNodesData([...questNodes, skillNode]);
    setEdgesData(questEdges);
  }, [questRelations, quests, skill]);

  return { nodesData, edgesData };
};
