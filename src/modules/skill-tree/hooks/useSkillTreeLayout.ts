import { useState, useEffect, useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { QuestNodeData, SkillNodeData } from "@/modules/canvas/canvas.type";
import type { SkillTreeLayoutType, SkillTreeNode, SkillTreeLayoutResult } from "../skill-tree.type";
import { LayoutFactory } from "../layout-strategies/layout-factory";
import type { DependencyGraph } from "../layout-strategies/shared/dependency-graph";

type UseSkillTreeLayoutProps = {
  nodes: Node<QuestNodeData | SkillNodeData>[];
  edges: Edge[];
  containerWidth: number;
  containerHeight: number;
  initialLayoutType?: SkillTreeLayoutType;
};

export const useSkillTreeLayout = ({
  nodes,
  edges,
  containerWidth,
  containerHeight,
  initialLayoutType = "circular",
}: UseSkillTreeLayoutProps) => {
  const [layoutType, setLayoutType] = useState<SkillTreeLayoutType>(initialLayoutType);
  const [skillTreeNodes, setSkillTreeNodes] = useState<SkillTreeNode[]>([]);
  const [dependencyGraph, setDependencyGraph] = useState<DependencyGraph>();
  const [isLoading, setIsLoading] = useState(true);

  const generateLayout = useCallback(
    async (newLayoutType: SkillTreeLayoutType) => {
      if (nodes.length === 0) return;

      setIsLoading(true);

      // Small delay for loading state
      await new Promise((resolve) => setTimeout(resolve, 200));

      try {
        const strategy = LayoutFactory.getStrategy(newLayoutType);
        const result: SkillTreeLayoutResult = strategy.generateLayout({
          nodes,
          edges,
          centerX: containerWidth / 2,
          centerY: containerHeight / 2,
          containerWidth,
          containerHeight,
        });

        setSkillTreeNodes(result.nodes);
        setDependencyGraph(result.graph);
      } catch (error) {
        console.error(`Error generating ${newLayoutType} layout:`, error);
        // Fallback to circular if hierarchical fails
        if (newLayoutType !== "circular") {
          const fallbackStrategy = LayoutFactory.getStrategy("circular");
          const fallbackResult = fallbackStrategy.generateLayout({
            nodes,
            edges,
            centerX: containerWidth / 2,
            centerY: containerHeight / 2,
            containerWidth,
            containerHeight,
          });
          setSkillTreeNodes(fallbackResult.nodes);
          setDependencyGraph(fallbackResult.graph);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [nodes, edges, containerWidth, containerHeight],
  );

  // Generate layout when dependencies change
  useEffect(() => {
    generateLayout(layoutType);
  }, [generateLayout, layoutType]);

  const changeLayoutType = useCallback(
    (newLayoutType: SkillTreeLayoutType) => {
      if (newLayoutType !== layoutType) {
        setLayoutType(newLayoutType);
        // Save to localStorage for persistence
        localStorage.setItem("skillTreeLayoutType", newLayoutType);
      }
    },
    [layoutType],
  );

  // Load saved layout type from localStorage on mount
  useEffect(() => {
    const savedLayoutType = localStorage.getItem("skillTreeLayoutType") as SkillTreeLayoutType;
    if (savedLayoutType && savedLayoutType !== layoutType) {
      setLayoutType(savedLayoutType);
    }
  }, [layoutType]);

  return {
    layoutType,
    skillTreeNodes,
    dependencyGraph,
    isLoading,
    changeLayoutType,
    availableLayouts: LayoutFactory.getAllLayoutTypes(),
  };
};
