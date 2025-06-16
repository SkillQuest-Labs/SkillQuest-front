export type CursorModeType = "normal" | "create" | "connect";
export type ViewModeType = "canvas" | "timeline";

export type FloatingToolboxProps = {
  cursorMode: CursorModeType;
  setCursorMode: (mode: CursorModeType) => void;
  setViewMode: (mode: ViewModeType) => void;
};
