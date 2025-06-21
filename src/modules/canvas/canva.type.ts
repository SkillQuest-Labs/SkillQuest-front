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
