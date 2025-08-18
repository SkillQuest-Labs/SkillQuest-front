import type { CSSProperties } from "react";

type NodeShape = "circle" | "square" | "diamond" | "hexagon";

export const nodeShapeStyle = (shape: NodeShape): CSSProperties => {
  switch (shape) {
    case "circle":
      return { borderRadius: "50%" };
    case "square":
      return { borderRadius: "4px" };
    case "diamond":
      return {
        borderRadius: "4px",
        transform: "rotate(45deg)",
      };
    case "hexagon":
      return {
        clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      };
    default:
      return { borderRadius: "50%" };
  }
};
