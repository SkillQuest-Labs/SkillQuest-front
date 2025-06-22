import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "@xyflow/react";

export interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  style?: React.CSSProperties;
  markerEnd?: string;
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  markerEnd,
}: CustomEdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "#00ffff",
          strokeWidth: 4,
          strokeDasharray: "4 2",
          ...style,
        }}
        markerEnd={markerEnd}
      />
      {/* Étiquette */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(${(sourceX + targetX) / 2}px, ${(sourceY + targetY) / 2}px)`,
            pointerEvents: "all",
          }}
          className="text-cyan-300 text-lg ml-5 font-semibold"
        >
          Connected
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
