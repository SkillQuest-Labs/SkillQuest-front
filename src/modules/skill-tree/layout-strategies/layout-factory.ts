import type { LayoutStrategy, SkillTreeLayoutType } from "../skill-tree.type";
import { CircularLayoutStrategy } from "./circular/circular-layout-strategy";
import { HierarchicalLayoutStrategy } from "./hierarchical/hierarchical-layout-strategy";

export class LayoutFactory {
  private static strategies: Record<SkillTreeLayoutType, LayoutStrategy> = {
    circular: new CircularLayoutStrategy(),
    hierarchical: new HierarchicalLayoutStrategy(),
  };

  static getStrategy(layoutType: SkillTreeLayoutType): LayoutStrategy {
    const strategy = this.strategies[layoutType];
    if (!strategy) {
      throw new Error(`Layout strategy '${layoutType}' not found`);
    }
    return strategy;
  }

  static getAllLayoutTypes(): SkillTreeLayoutType[] {
    return Object.keys(this.strategies) as SkillTreeLayoutType[];
  }
}
