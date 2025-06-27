import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { ChevronUp, ChevronDown } from "lucide-react";

import type { QuestNodeData } from "../canvas.type";
import { useRef } from "react";
import { QuestCard } from "./QuestCard";

export const QuestNode = ({ id, data }: NodeProps<Node<QuestNodeData>>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const blackHoleRef = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    if (!nodeRef.current || !blackHoleRef.current) return;
    data.onDelete?.(id);
  };

  const toggleCollapse = () => {
    data.onUpdate?.("isCollapsed", !data.isCollapsed);
  };

  if (data.isCollapsed) {
    return (
      <div ref={blackHoleRef}>
        <div
          ref={nodeRef}
          className="relative rounded-xl p-4 bg-yellow-300/30 border border-yellow-400 shadow-md"
        >
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 bg-yellow-400"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="w-3 h-3 bg-yellow-400"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse();
            }}
            className="absolute top-1 right-1 bg-white/20 rounded p-1"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="text-yellow-900 font-semibold text-center">
            {data.title}
          </div>
          {data.childCount !== undefined && (
            <div className="text-xs text-yellow-800 text-center">
              {data.childCount}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={blackHoleRef}>
      <div
        ref={nodeRef}
        className="relative rounded-3xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.25)] border-2 border-cyan-400/60 z-10 ring-4 ring-cyan-300/10 bg-cover max-h-[560px]"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse();
          }}
          className="absolute top-4 right-16 z-20 bg-white/20 rounded p-1"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <QuestCard
          data={data}
          onDelete={handleDelete}
          sourceHandle={
            <Handle
              type="target"
              position={Position.Top}
              style={{ width: "20px", height: "20px" }}
              className="bg-gradient-to-r from-purple-700/30 via-yellow-100/20 to-purple-900/30 rounded-xl p-2 border-2 border-yellow-300/40 backdrop-blur-md mb-5 shadow-[0_2px_12px_2px_rgba(128,0,255,0.10)] hover:scale-110 transition-transform z-20"
            />
          }
          targetHandle={
            <Handle
              type="source"
              position={Position.Bottom}
              style={{ width: "20px", height: "20px" }}
              className="bg-gradient-to-br from-purple-700/30 via-yellow-100/20 to-purple-900/30 rounded-xl p-2 border-2 border-yellow-300/40 backdrop-blur-md shadow-[0_2px_12px_2px_rgba(128,0,255,0.10)] hover:scale-110 transition-transform z-20"
            />
          }
        />
      </div>
    </div>
  );
};
