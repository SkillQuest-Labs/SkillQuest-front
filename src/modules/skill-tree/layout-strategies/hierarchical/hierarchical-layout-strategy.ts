import { isSkillNode, isQuestNode } from "@/modules/canvas/canvas.const";
import type {
  LayoutStrategy,
  GenerateLayoutProps,
  SkillTreeLayoutResult,
  HierarchicalSkillNode,
} from "../../skill-tree.type";
import { DependencyGraph } from "../shared/dependency-graph";

export class HierarchicalLayoutStrategy implements LayoutStrategy {
  generateLayout({ nodes, edges, containerWidth = 800 }: GenerateLayoutProps): SkillTreeLayoutResult {
    const graph = new DependencyGraph();

    // First pass: Add all nodes to the graph
    nodes.forEach((node) => {
      if (isSkillNode(node)) {
        graph.addNode({
          id: node.id,
          title: node.data.config.title,
          description: node.data.config.description || "",
          position: { x: 0, y: 0 }, // Will be calculated
          size: 60,
          shape: "circle",
          nodeType: "mastery",
          status: node.data.config.status,
          isLocked: false,
          connections: [],
          prerequisites: [],
          level: 0, // Root level
          column: 0,
          branchPath: [],
        } as HierarchicalSkillNode);
      } else if (isQuestNode(node)) {
        graph.addNode({
          id: node.id,
          title: node.data.title,
          description: node.data.description,
          position: { x: 0, y: 0 }, // Will be calculated
          size: 40,
          shape: "square",
          nodeType: "medium",
          status: node.data.status,
          isLocked: true, // Will be calculated
          connections: [],
          prerequisites: [],
          level: 1, // Will be calculated
          column: 0, // Will be calculated
          branchPath: [], // Will be calculated
        } as HierarchicalSkillNode);
      }
    });

    // Second pass: Add edges
    edges.forEach((edge) => {
      graph.addEdge(edge.source, edge.target);
    });

    // Calculate hierarchical levels
    const hierarchicalNodes = this.calculateHierarchicalPositions(graph, nodes, containerWidth);

    // Update node positions and properties
    hierarchicalNodes.forEach((node) => {
      const graphNode = graph.getNode(node.id);
      if (graphNode) {
        graphNode.position = node.position;
        (graphNode as HierarchicalSkillNode).level = node.level;
        (graphNode as HierarchicalSkillNode).column = node.column;
        (graphNode as HierarchicalSkillNode).branchPath = node.branchPath;

        // Update connections and prerequisites
        graphNode.connections = graph.getDependents(node.id);
        graphNode.prerequisites = graph.getPrerequisites(node.id);

        // Calculate locked status
        graphNode.isLocked = !graph.isUnlocked(node.id);
      }
    });

    return {
      nodes: hierarchicalNodes,
      graph,
    };
  }

  private calculateHierarchicalPositions(
    graph: DependencyGraph,
    originalNodes: any[],
    containerWidth: number,
  ): HierarchicalSkillNode[] {
    const skillNode = originalNodes.find(isSkillNode);
    if (!skillNode) return [];

    const levels: Record<number, HierarchicalSkillNode[]> = {};
    const visited = new Set<string>();
    const nodePositions: Record<string, HierarchicalSkillNode> = {};

    // Start with skill node at level 0
    const skillHierarchicalNode: HierarchicalSkillNode = {
      id: skillNode.id,
      title: skillNode.data.config.title,
      description: skillNode.data.config.description || "",
      position: { x: containerWidth / 2, y: 50 },
      size: 60,
      shape: "circle",
      nodeType: "mastery",
      status: skillNode.data.config.status,
      isLocked: false,
      connections: graph.getDependents(skillNode.id),
      prerequisites: [],
      level: 0,
      column: 0,
      branchPath: [],
    };

    levels[0] = [skillHierarchicalNode];
    nodePositions[skillNode.id] = skillHierarchicalNode;
    visited.add(skillNode.id);

    // BFS to assign levels
    const queue = [{ nodeId: skillNode.id, level: 0 }];

    while (queue.length > 0) {
      const { nodeId, level } = queue.shift()!;
      const dependents = graph.getDependents(nodeId);

      dependents.forEach((dependentId) => {
        if (!visited.has(dependentId)) {
          const originalNode = originalNodes.find((n) => n.id === dependentId);
          if (originalNode && isQuestNode(originalNode)) {
            const newLevel = level + 1;

            if (!levels[newLevel]) {
              levels[newLevel] = [];
            }

            const hierarchicalNode: HierarchicalSkillNode = {
              id: dependentId,
              title: originalNode.data.title,
              description: originalNode.data.description,
              position: { x: 0, y: 0 }, // Will be calculated below
              size: 40,
              shape: "square",
              nodeType: "medium",
              status: originalNode.data.status,
              isLocked: true,
              connections: graph.getDependents(dependentId),
              prerequisites: graph.getPrerequisites(dependentId),
              level: newLevel,
              column: levels[newLevel].length,
              branchPath: [...(nodePositions[nodeId]?.branchPath || []), nodeId],
            };

            levels[newLevel].push(hierarchicalNode);
            nodePositions[dependentId] = hierarchicalNode;
            visited.add(dependentId);

            queue.push({ nodeId: dependentId, level: newLevel });
          }
        }
      });
    }

    // Calculate positions for each level
    const levelHeight = 120;
    const nodeSpacing = 150;

    Object.keys(levels).forEach((levelKey) => {
      const level = parseInt(levelKey);
      const nodesInLevel = levels[level];
      const y = 50 + level * levelHeight;

      // Center the nodes horizontally
      const totalWidth = (nodesInLevel.length - 1) * nodeSpacing;
      const startX = (containerWidth - totalWidth) / 2;

      nodesInLevel.forEach((node, index) => {
        node.position = {
          x: startX + index * nodeSpacing,
          y: y,
        };
      });
    });

    // Flatten all nodes
    return Object.values(levels).flat();
  }
}
