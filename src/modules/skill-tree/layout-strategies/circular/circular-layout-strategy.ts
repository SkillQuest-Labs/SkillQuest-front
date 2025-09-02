import { isSkillNode } from "@/modules/canvas/canvas.const";
import type {
  LayoutStrategy,
  GenerateLayoutProps,
  SkillTreeLayoutResult,
  CircularSkillNode,
} from "../../skill-tree.type";

// Import existing circular logic functions
import { buildDependencyGraph } from "../../circular-skill-tree-logic/init/build-dependency-graph";
import { computeNodeLevels } from "../../circular-skill-tree-logic/generate-circular-skill-tree-logic/compute-node-levels";
import { findRootQuestIds } from "../../circular-skill-tree-logic/generate-circular-skill-tree-logic/find-root-quest-ids";
import { generateCircularNodesData } from "../../circular-skill-tree-logic/generate-circular-skill-tree-logic/generate-circular-nodes-data";

export class CircularLayoutStrategy implements LayoutStrategy {
  generateLayout({ nodes, edges, centerX, centerY }: GenerateLayoutProps): SkillTreeLayoutResult {
    const graph = buildDependencyGraph(nodes, edges);
    const rootQuestIds = findRootQuestIds(nodes, edges, graph);

    // Add center node to graph and connect it to root quests (using skill node's actual ID)
    const skillNode = nodes.find(isSkillNode);
    if (skillNode) {
      const existingSkillNode = graph.getNode(skillNode.id);
      if (existingSkillNode) {
        existingSkillNode.position = { x: centerX, y: centerY };
        existingSkillNode.size = 50;
        existingSkillNode.shape = "circle";
        existingSkillNode.nodeType = "mastery";
        (existingSkillNode as CircularSkillNode).ring = 0;
        (existingSkillNode as CircularSkillNode).angle = 0;
        existingSkillNode.connections = rootQuestIds;
      } else {
        graph.addNode({
          id: skillNode.id,
          title: skillNode.data.config.title,
          description: skillNode.data.config.description || "",
          position: { x: centerX, y: centerY },
          size: 50,
          shape: "circle",
          nodeType: "mastery",
          status: "NOT_STARTED",
          isLocked: false,
          connections: rootQuestIds,
          prerequisites: [],
          ring: 0,
          angle: 0,
          icon: skillNode.data.config.icon,
        } as CircularSkillNode);
      }

      // Connect skill node to root quests (only if not already connected)
      rootQuestIds.forEach((rootId) => {
        const existingPrereqs = graph.getPrerequisites(rootId);
        if (!existingPrereqs.includes(skillNode.id)) {
          graph.addEdge(skillNode.id, rootId);
        }
      });
    }

    const { visitedLevels, maxLevel } = computeNodeLevels({ graph, rootQuestIds });

    // Radii for rings 0 to maxLevel
    const ringRadii = Array.from({ length: maxLevel + 1 }, (_, i) => i * 100);

    const circularSkillNodes = generateCircularNodesData({
      nodes,
      visitedLevels,
      graph,
      ringRadii,
      centerX,
      centerY,
    });

    // Now that all nodes are in the graph with their prerequisites, determine if each node is locked
    const skillNodeId = skillNode?.id;
    circularSkillNodes.forEach((node) => {
      if (node.id !== skillNodeId) {
        const isConnectedToSkill = skillNodeId && node.prerequisites.includes(skillNodeId);
        node.isLocked = !isConnectedToSkill;
        node.status = isConnectedToSkill ? "UNLOCKED" : "LOCKED";
        node.icon = isConnectedToSkill ? "🔓" : "🔒";
      }
    });

    if (skillNodeId) {
      const skillCircularNode = graph.getNode(skillNodeId);
      if (skillCircularNode) {
        // Add the central node at the beginning of the array
        circularSkillNodes.unshift(skillCircularNode as CircularSkillNode);
      }
    }

    return {
      nodes: circularSkillNodes,
      graph,
    };
  }
}
