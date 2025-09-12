import type { QuestLayoutConfig, QuestPosition, QuestLayoutInput } from './quest-layout.types';

/**
 * Default configuration for quest grid layout
 */
const DEFAULT_CONFIG: QuestLayoutConfig = {
  baseY: 350, // Offset from skill node Y position
  baseX: -200, // Offset from skill node X position
  questSpacingY: 525, // Vertical spacing between quests
  questSpacingX: 400, // Horizontal spacing between quests
  groupSpacingX: 800, // Spacing between groups
  questsPerGroup: 3, // Number of quests per group
};

/**
 * Calculates positions for quests in a grid layout with alternating vertical/horizontal groups
 * 
 * @param input - Layout input parameters
 * @returns Array of quest positions
 */
export function calculateQuestGridLayout(input: QuestLayoutInput): QuestPosition[] {
  const { skillPosition, questCount, config: userConfig = {} } = input;
  
  // Merge user config with defaults
  const config: QuestLayoutConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  const positions: QuestPosition[] = [];
  
  // Calculate base positions
  const baseY = skillPosition.y + config.baseY;
  const baseX = skillPosition.x + config.baseX;

  for (let index = 0; index < questCount; index++) {
    // Determine group and position within group
    const groupIndex = Math.floor(index / config.questsPerGroup);
    const positionInGroup = index % config.questsPerGroup;
    const isVerticalGroup = groupIndex % 2 === 0; // Even groups (0, 2, 4...) are vertical

    let position: QuestPosition;
    
    if (isVerticalGroup) {
      // Vertical group: stack quests vertically
      position = {
        x: baseX + groupIndex * config.groupSpacingX,
        y: baseY + positionInGroup * config.questSpacingY,
      };
    } else {
      // Horizontal group: arrange quests horizontally
      position = {
        x: baseX + groupIndex * config.groupSpacingX + positionInGroup * config.questSpacingX,
        y: baseY,
      };
    }

    positions.push(position);
  }

  return positions;
}

/**
 * Calculates a single quest position by index
 * 
 * @param input - Layout input parameters
 * @param questIndex - Index of the quest to calculate position for
 * @returns Quest position
 */
export function calculateSingleQuestPosition(
  input: QuestLayoutInput,
  questIndex: number
): QuestPosition {
  const { skillPosition, config: userConfig = {} } = input;
  
  // Merge user config with defaults
  const config: QuestLayoutConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  // Calculate base positions
  const baseY = skillPosition.y + config.baseY;
  const baseX = skillPosition.x + config.baseX;

  // Determine group and position within group
  const groupIndex = Math.floor(questIndex / config.questsPerGroup);
  const positionInGroup = questIndex % config.questsPerGroup;
  const isVerticalGroup = groupIndex % 2 === 0; // Even groups (0, 2, 4...) are vertical

  if (isVerticalGroup) {
    // Vertical group: stack quests vertically
    return {
      x: baseX + groupIndex * config.groupSpacingX,
      y: baseY + positionInGroup * config.questSpacingY,
    };
  } else {
    // Horizontal group: arrange quests horizontally
    return {
      x: baseX + groupIndex * config.groupSpacingX + positionInGroup * config.questSpacingX,
      y: baseY,
    };
  }
}