import type { SkillTreeNode } from "../../skill-tree.type";

/**
 * A dependency graph implementation for managing skill tree nodes and their relationships.
 * This class handles prerequisites and dependencies between skills, allowing for
 * validation of unlock conditions and traversal of skill paths.
 */
export class DependencyGraph {
  private nodes: Record<string, SkillTreeNode> = {};
  private edges: Record<string, string[]> = {};
  private reverseEdges: Record<string, string[]> = {};

  addNode(node: SkillTreeNode) {
    this.nodes[node.id] = node;
    if (!this.edges[node.id]) {
      this.edges[node.id] = [];
    }
    if (!this.reverseEdges[node.id]) {
      this.reverseEdges[node.id] = [];
    }
  }

  addEdge(from: string, to: string) {
    if (!this.edges[from]) {
      this.edges[from] = [];
    }
    if (!this.reverseEdges[to]) {
      this.reverseEdges[to] = [];
    }

    if (!this.edges[from].includes(to)) {
      this.edges[from].push(to);
    }
    if (!this.reverseEdges[to].includes(from)) {
      this.reverseEdges[to].push(from);
    }
  }

  getNode(id: string) {
    return this.nodes[id];
  }

  getPrerequisites(nodeId: string): string[] {
    return this.reverseEdges[nodeId] || [];
  }

  getDependents(nodeId: string): string[] {
    return this.edges[nodeId] || [];
  }

  isUnlocked(nodeId: string): boolean {
    const prerequisites = this.getPrerequisites(nodeId);
    if (prerequisites.length === 0) return true;

    return prerequisites.every((prereqId) => {
      const prereqNode = this.nodes[prereqId];
      return prereqNode?.status === "COMPLETED";
    });
  }

  // method to get all ancestors (prerequisites)
  getAncestors(nodeId: string): string[] {
    const ancestors = new Set<string>();
    const queue = [nodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const prereqs = this.getPrerequisites(currentId);
      for (const prereq of prereqs) {
        if (!ancestors.has(prereq)) {
          ancestors.add(prereq);
          queue.push(prereq);
        }
      }
    }
    return Array.from(ancestors);
  }

  // method to get all descendants (dependents)
  getDescendants(nodeId: string): string[] {
    const descendants = new Set<string>();
    const queue = [nodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const dependents = this.getDependents(currentId);
      for (const dependent of dependents) {
        if (!descendants.has(dependent)) {
          descendants.add(dependent);
          queue.push(dependent);
        }
      }
    }
    return Array.from(descendants);
  }

  // method to get all nodes in the connected path (ancestors + descendants)
  getConnectedPath(nodeId: string): string[] {
    const pathNodes = new Set<string>();
    pathNodes.add(nodeId); // Include the clicked node itself

    this.getAncestors(nodeId).forEach((id) => pathNodes.add(id));
    this.getDescendants(nodeId).forEach((id) => pathNodes.add(id));

    return Array.from(pathNodes);
  }
}
