import type { Edge, Node } from "@xyflow/react";
import type { DependencyGraph } from "./dependency-graph";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import { isQuestNode, isSkillNode } from "@/modules/canvas/canvas.const";

//Identify Root Nodes (connected to skill-block or no prerequisites)
export const findRootQuestIds = (
  nodes: Node<QuestNodeData | SkillNodeData>[],
  edges: Edge[],
  graph: DependencyGraph,
): string[] => {
  const rootQuestIds: string[] = [];

  const skillNodeId = nodes.find(isSkillNode)?.id;
  // collect all node ids that are directly connected to "skill-block".
  edges
    .filter((e) => e.source === skillNodeId)
    .forEach((e) => {
      rootQuestIds.push(e.target);
    });

  // If no quests are connected to skill-block, find quests with no prerequisites
  if (rootQuestIds.length === 0) {
    nodes.filter(isQuestNode).forEach((node) => {
      if (graph.getPrerequisites(node.id).length === 0) {
        rootQuestIds.push(node.id);
      }
    });
  }
  return rootQuestIds;
};
