import { useState, useCallback, useRef, useEffect } from "react";
import type { DebugLog, LogLevel, DebugModalState, Position, Size } from "./debug-modal.types";

/**
 * Interface pour l'objet window étendu avec debugLogger
 */
interface WindowWithDebugLogger extends Window {
  debugLogger?: {
    info: (message: string, data?: unknown) => void;
    warn: (message: string, data?: unknown) => void;
    error: (message: string, data?: unknown) => void;
    debug: (message: string, data?: unknown) => void;
  };
}

const INITIAL_POSITION: Position = { x: 20, y: 20 };
const INITIAL_SIZE: Size = { width: 400, height: 300 };
const MIN_SIZE: Size = { width: 300, height: 200 };

export const useDebugModal = () => {
  const [state, setState] = useState<DebugModalState>({
    logs: [],
    isMinimized: false,
    position: INITIAL_POSITION,
    size: INITIAL_SIZE,
    isDragging: false,
    isResizing: false,
  });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // Ajouter un log
  const addLog = useCallback((level: LogLevel, message: string, data?: unknown) => {
    const newLog: DebugLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: new Date(),
      data,
    };

    setState((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 1000), // Limiter à 1000 logs
    }));
  }, []);

  const clearLogs = useCallback(() => {
    setState((prev) => ({ ...prev, logs: [] }));
  }, []);

  // Toggle minimized
  const toggleMinimized = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  // Drag handling
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("debug-modal-header")) {
        dragStartRef.current = {
          x: e.clientX - state.position.x,
          y: e.clientY - state.position.y,
        };
        setState((prev) => ({ ...prev, isDragging: true }));
      }
    },
    [state.position],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (state.isDragging && dragStartRef.current) {
        const newPosition = {
          x: Math.max(0, Math.min(window.innerWidth - state.size.width, e.clientX - dragStartRef.current.x)),
          y: Math.max(0, Math.min(window.innerHeight - 40, e.clientY - dragStartRef.current.y)),
        };
        setState((prev) => ({ ...prev, position: newPosition }));
      }

      if (state.isResizing && resizeStartRef.current) {
        const newWidth = Math.max(MIN_SIZE.width, e.clientX - resizeStartRef.current.x + resizeStartRef.current.width);
        const newHeight = Math.max(
          MIN_SIZE.height,
          e.clientY - resizeStartRef.current.y + resizeStartRef.current.height,
        );
        setState((prev) => ({ ...prev, size: { width: newWidth, height: newHeight } }));
      }
    },
    [state.isDragging, state.isResizing, state.size],
  );

  const handleMouseUp = useCallback(() => {
    setState((prev) => ({ ...prev, isDragging: false, isResizing: false }));
    dragStartRef.current = null;
    resizeStartRef.current = null;
  }, []);

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: state.size.width,
        height: state.size.height,
      };
      setState((prev) => ({ ...prev, isResizing: true }));
    },
    [state.size],
  );

  // Event listeners globaux
  useEffect(() => {
    if (state.isDragging || state.isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [state.isDragging, state.isResizing, handleMouseMove, handleMouseUp]);

  // Global API to add logs from anywhere
  useEffect(() => {
    const globalDebugLogger = {
      error: (message: string, data?: unknown) => addLog("error", message, data),
      warn: (message: string, data?: unknown) => addLog("warn", message, data),
      info: (message: string, data?: unknown) => addLog("info", message, data),
      debug: (message: string, data?: unknown) => addLog("debug", message, data),
    };

    // Exposer globalement en mode développement
    if (import.meta.env.DEV) {
      (window as WindowWithDebugLogger).debugLogger = globalDebugLogger;
    }

    return () => {
      if (import.meta.env.DEV) {
        delete (window as WindowWithDebugLogger).debugLogger;
      }
    };
  }, [addLog]);

  return {
    state,
    addLog,
    clearLogs,
    toggleMinimized,
    handleMouseDown,
    handleResizeMouseDown,
  };
};
