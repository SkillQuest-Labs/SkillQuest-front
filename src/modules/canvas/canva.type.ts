export type CursorModeType = "normal" | "create" | "connect";
export type ViewModeType = "canvas" | "timeline";

export type FloatingToolboxProps = {
  cursorMode: CursorModeType;
  setCursorMode: (mode: CursorModeType) => void;
  setViewMode: (mode: ViewModeType) => void;
};

export type SkillConfigType = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type SkillConfig = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type SkillNodeData = {
  config: SkillConfig;
  onUpdate: (field: string, value: any) => void;
};

export type ProgressStatus = "not-started" | "in-progress" | "completed";
export type QuestType = "main" | "side" | "challenge" | "reward";
export type QuestDifficulty = "Easy" | "Medium" | "Hard";

export type QuestData = {
  title: string;
  xp: number;
  difficulty: QuestDifficulty;
  description: string;
  isStarting?: boolean;
  status: ProgressStatus;
  questNumber?: number;
  type?: QuestType;
  isCollapsed?: boolean;
  childCount?: number;
  onUpdate?: (field: string, value: any) => void;
};
