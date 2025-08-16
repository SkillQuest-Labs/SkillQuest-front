import type { QuestStatus } from "@/shared/types/quest.type";
import type { SkillDifficulty, SkillStatus } from "@/shared/types/skill.type";

export type CursorModeType = "normal" | "create" | "connect" | "collapse" | "expand";
export type ViewModeType = "canvas" | "skillTree";

export type FloatingToolboxProps = {
  cursorMode: CursorModeType;
  setCursorMode: (mode: CursorModeType) => void;
  collapseAll: () => void;
  expandAll: () => void;
  setOpenAiModal: (open: boolean) => void;
  className?: string;
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
  status: SkillStatus;
  difficulty: SkillDifficulty;
  icon?: string;
  color?: string;
};

export type SkillNodeData = {
  kind: "skill";
  config: SkillConfig;
  onUpdate?: (field: string, value: any) => void;
};

export type QuestNodeData = {
  kind: "quest";
  title: string;
  description: string;
  isStarting?: boolean;
  status: QuestStatus;
  questNumber?: number;
  isCollapsed?: boolean;
  isSubSkill?: boolean;
  childCount?: number;
  onUpdate?: (field: string, value: any) => void;
  onDelete?: (id: string) => void;
};

export type QuestCardProps = {
  data: QuestNodeData;
  onDelete: () => void;
  targetHandle?: React.ReactNode;
  sourceHandle?: React.ReactNode;
  isCollapsed?: boolean;
  connectionCount?: number;
};
