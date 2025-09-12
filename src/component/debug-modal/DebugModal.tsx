import React from "react";
import type { DebugModalProps, LogLevel } from "./debug-modal.types";
import { useDebugModal } from "./useDebugModal";
import "./../../styles/debug-modal.css";
import { Button } from "@/shared/components/ui/button";

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  error: "#ef4444",
  warn: "#f59e0b",
  info: "#3b82f6",
  debug: "#6b7280",
};

const LOG_LEVEL_ICONS: Record<LogLevel, string> = {
  error: "❌",
  warn: "⚠️",
  info: "ℹ️",
  debug: "🔧",
};

const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const DebugModal: React.FC<DebugModalProps> = ({ isOpen, onToggle }) => {
  const { state, clearLogs, toggleMinimized, handleMouseDown, handleResizeMouseDown } = useDebugModal();

  // Ne pas afficher en production
  if (import.meta.env.PROD) {
    return null;
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        className="debug-modal-toggle debug-modal-toggle-closed"
        onClick={onToggle}
        title="Ouvrir la console de debug"
      >
        🐛
      </Button>
    );
  }

  return (
    <div
      className={`debug-modal ${state.isMinimized ? "debug-modal-minimized" : ""}`}
      style={{
        left: state.position.x,
        top: state.position.y,
        width: state.isMinimized ? "auto" : state.size.width,
        height: state.isMinimized ? "auto" : state.size.height,
      }}
    >
      {/* Header */}
      <div className="debug-modal-header" onMouseDown={handleMouseDown}>
        <div className="debug-modal-title">
          <span className="debug-modal-icon">🐛</span>
          <span>Debug Console</span>
          <span className="debug-modal-count">({state.logs.length})</span>
        </div>
        <div className="debug-modal-controls">
          <Button
            variant="ghost"
            className="debug-modal-btn debug-modal-btn-clear"
            onClick={clearLogs}
            title="Effacer les logs"
            disabled={state.logs.length === 0}
          >
            🗑️
          </Button>
          <Button
            variant="ghost"
            className="debug-modal-btn debug-modal-btn-minimize"
            onClick={toggleMinimized}
            title={state.isMinimized ? "Agrandir" : "Réduire"}
          >
            {state.isMinimized ? "🔼" : "🔽"}
          </Button>
          <Button variant="ghost" className="debug-modal-btn debug-modal-btn-close" onClick={onToggle} title="Fermer">
            ✕
          </Button>
        </div>
      </div>

      {/* Content */}
      {!state.isMinimized && (
        <>
          <div className="debug-modal-content">
            {state.logs.length === 0 ? (
              <div className="debug-modal-empty">
                <p>Aucun log pour le moment</p>
                <p className="debug-modal-help">
                  Utilisez <code>window.debugLogger.info('message')</code> pour ajouter des logs
                </p>
              </div>
            ) : (
              <div className="debug-modal-logs">
                {state.logs.map((log) => (
                  <div key={log.id} className={`debug-modal-log debug-modal-log-${log.level}`}>
                    <div className="debug-modal-log-header">
                      <span className="debug-modal-log-icon" style={{ color: LOG_LEVEL_COLORS[log.level] }}>
                        {LOG_LEVEL_ICONS[log.level]}
                      </span>
                      <span className="debug-modal-log-level">{log.level.toUpperCase()}</span>
                      <span className="debug-modal-log-timestamp">{formatTimestamp(log.timestamp)}</span>
                    </div>
                    <div className="debug-modal-log-message">{log.message}</div>
                    {log.data && (
                      <div className="debug-modal-log-data">
                        <pre>{JSON.stringify(log.data, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resize handle */}
          <div className="debug-modal-resize-handle" onMouseDown={handleResizeMouseDown} title="Redimensionner">
            ↘️
          </div>
        </>
      )}
    </div>
  );
};

export default DebugModal;
