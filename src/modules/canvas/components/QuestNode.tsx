import { Handle, Position, useStore, type Node, type NodeProps } from "@xyflow/react";
import { useRef, type MouseEvent } from "react";

import { Button } from "@/shared/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import type { QuestNodeData } from "../canvas.type";
import { QuestCard } from "./QuestCard";

export const QuestNode = ({ id, data }: NodeProps<Node<QuestNodeData>>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const blackHoleRef = useRef<HTMLDivElement>(null);
  const markDeletedNode = useCanvasStore((state) => state.markDeletedNode);
  const { cursorMode } = useCanvasStore((state) => state);
  const isConnect = cursorMode === "connect";

  const connectionCount = useStore(
    (state) => state.edges.filter((edge) => edge.source === id || edge.target === id).length,
  );

  const handleDelete = () => {
    if (!nodeRef.current || !blackHoleRef.current) return;

    markDeletedNode(id);

    data.onDelete?.(id);
  };

  const handleViewQuest = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (data.onView) {
      data.onView(id);
      return;
    }

    const nodeElement = nodeRef.current?.closest(".react-flow__node") as HTMLElement | null;

    nodeElement?.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );
  };

  const handleTooltipDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleDelete();
  };

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <div ref={blackHoleRef}>
          <div
            ref={nodeRef}
            className="relative rounded-3xl p-8 shadow-[0_0_40px_rgba(0,255,255,0.25)] border-2 border-cyan-400/60 z-10 ring-4 ring-cyan-300/10 bg-cover max-h-[560px]"
          >
            <QuestCard
              data={data}
              onDelete={handleDelete}
              isCollapsed={data.isCollapsed}
              connectionCount={connectionCount}
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
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={18}
        className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/90 px-4 py-3 text-slate-100 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.7)] backdrop-blur-md"
      >
        <Button
          variant="default"
          size="sm"
          onClick={handleViewQuest}
          className="cursor-pointer rounded-full border border-slate-700/70 bg-slate-900/70 px-4 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          Voir la quête
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleTooltipDelete}
          className="cursor-pointer rounded-full border border-red-700/70 bg-red-900/40 px-4 text-xs font-semibold uppercase tracking-wide text-red-200 transition hover:border-red-500 hover:text-red-100"
        >
          Supprimer
        </Button>
      </TooltipContent>
    </Tooltip>
  );
};
