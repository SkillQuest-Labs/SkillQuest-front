import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

import type { QuestNodeData } from "../canvas.type";
import { useRef } from "react";
import { QuestCard } from "./QuestCard";
import { useCanvasStore } from "@/stores/quest/canvas-store";

export const QuestNode = ({ id, data }: NodeProps<Node<QuestNodeData>>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const blackHoleRef = useRef<HTMLDivElement>(null);
  const markDeletedNode = useCanvasStore((state) => state.markDeletedNode);
  const { cursorMode } = useCanvasStore((state) => state);
  const isConnect = cursorMode === "connect";

  const handleDelete = () => {
    if (!nodeRef.current || !blackHoleRef.current) return;

    markDeletedNode(id);

    data.onDelete?.(id);
  };

  return (
    <div ref={blackHoleRef}>
      <div
        ref={nodeRef}
        className="relative rounded-3xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.25)] border-2 border-cyan-400/60 z-10 ring-4 ring-cyan-300/10 bg-cover max-h-[560px]"
      >
        <QuestCard
          data={data}
          onDelete={handleDelete}
          isCollapsed={data.isCollapsed}
          sourceHandle={
            <Handle
              type="target"
              position={Position.Top}
              style={{
                width: "20px",
                height: "20px",
                opacity: isConnect ? 1 : 0.4,
                pointerEvents: isConnect ? "auto" : "none",
                background: isConnect
                  ? "linear-gradient(to right, rgba(126, 34, 206, 0.8), rgba(254, 243, 199, 0.6), rgba(88, 28, 135, 0.8))"
                  : "linear-gradient(to right, rgba(126, 34, 206, 0.3), rgba(254, 243, 199, 0.2), rgba(88, 28, 135, 0.3))", // ou une couleur grise
                borderColor: isConnect ? "#FFD700" : "#888",
              }}
              className="bg-gradient-to-r from-purple-700/30 via-yellow-100/20 to-purple-900/30 rounded-xl p-2 border-2 border-yellow-300/40 backdrop-blur-md mb-5 shadow-[0_2px_12px_2px_rgba(128,0,255,0.10)] hover:scale-110 transition-transform z-20"
            />
          }
          targetHandle={
            <Handle
              type="source"
              position={Position.Bottom}
              style={{
                width: "20px",
                height: "20px",
                opacity: isConnect ? 1 : 0.4,
                pointerEvents: isConnect ? "auto" : "none",
                background: isConnect
                  ? "linear-gradient(to bottom right, rgba(126, 34, 206, 0.8), rgba(254, 243, 199, 0.6), rgba(88, 28, 135, 0.8))"
                  : "linear-gradient(to bottom right, rgba(126, 34, 206, 0.3), rgba(254, 243, 199, 0.2), rgba(88, 28, 135, 0.3))", // ou une couleur grise
                borderColor: isConnect ? "#FFD700" : "#888",
              }}
              className="bg-gradient-to-br from-purple-700/30 via-yellow-100/20 to-purple-900/30 rounded-xl p-2 border-2 border-yellow-300/40 backdrop-blur-md shadow-[0_2px_12px_2px_rgba(128,0,255,0.10)] hover:scale-110 transition-transform z-20"
            />
          }
        />
      </div>
    </div>
  );
};
