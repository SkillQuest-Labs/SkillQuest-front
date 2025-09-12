/**
 * Types for quest grid layout system
 */

/**
 * Configuration for quest grid layout
 */
export interface QuestLayoutConfig {
  /** Base Y position for quest placement */
  baseY: number;
  /** Base X position for quest placement */
  baseX: number;
  /** Vertical spacing between quests in vertical groups */
  questSpacingY: number;
  /** Horizontal spacing between quests in horizontal groups */
  questSpacingX: number;
  /** Spacing between different groups */
  groupSpacingX: number;
  /** Number of quests per group */
  questsPerGroup: number;
}

/**
 * Position coordinates for a quest
 */
export interface QuestPosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Input parameters for calculating quest positions
 */
export interface QuestLayoutInput {
  /** Position of the skill node */
  skillPosition: { x: number; y: number };
  /** Total number of quests to position */
  questCount: number;
  /** Layout configuration */
  config?: Partial<QuestLayoutConfig>;
}
