export type LogLevel = "error" | "warn" | "info" | "debug";

export interface DebugLog {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

export interface DebugModalProps {
  isOpen: boolean;
  onToggle: () => void;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DebugModalState {
  logs: DebugLog[];
  isMinimized: boolean;
  position: Position;
  size: Size;
  isDragging: boolean;
  isResizing: boolean;
}
