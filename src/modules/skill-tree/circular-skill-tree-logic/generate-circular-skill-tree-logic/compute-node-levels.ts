import type { DependencyGraph } from "../../layout-strategies/shared/dependency-graph";

type ComputeNodeLevelsProps = {
  graph: DependencyGraph;
  rootQuestIds: string[];
};

// Compute the level of each node in the graph
export const computeNodeLevels = ({ graph, rootQuestIds }: ComputeNodeLevelsProps) => {
  const queue: Array<{ nodeId: string; level: number }> = [];
  const visitedLevels: Record<string, number> = {};

  rootQuestIds.forEach((rootId) => {
    queue.push({ nodeId: rootId, level: 1 });
    visitedLevels[rootId] = 1;
  });

  let maxLevel = 0;

  while (queue.length > 0) {
    const { nodeId, level } = queue.shift()!;
    maxLevel = Math.max(maxLevel, level);

    const descendants = graph.getDependents(nodeId); // direct child
    for (const depId of descendants) {
      if (!visitedLevels[depId] || visitedLevels[depId] < level + 1) {
        visitedLevels[depId] = level + 1;
        queue.push({ nodeId: depId, level: level + 1 });
      }
    }
  }

  return { visitedLevels, maxLevel };
};
