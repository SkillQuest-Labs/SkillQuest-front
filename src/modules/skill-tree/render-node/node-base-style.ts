import type { CSSProperties } from "react";
import type { CircularSkillNode } from "../skill-tree.type";

type BaseNodeStyle = {
  node: CircularSkillNode;
  color: string;
  borderColor: string;
  isPathHighlighted: boolean;
  isActive: boolean;
  isSelected: boolean;
};

export const nodeBaseStyle = ({
  node,
  color,
  borderColor,
  isPathHighlighted,
  isActive,
  isSelected,
}: BaseNodeStyle): CSSProperties => ({
  position: "absolute" as const,
  left: node.position.x - node.size / 2,
  top: node.position.y - node.size / 2,
  width: node.size,
  height: node.size,
  backgroundColor: color,
  border: `2px solid ${borderColor}`,
  cursor: "pointer",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: node.size > 30 ? "16px" : "12px",
  fontWeight: "bold",
  color: "white",
  boxShadow: isPathHighlighted
    ? "0 0 25px rgba(255,165,0,0.8)"
    : isActive
      ? `0 0 20px ${color}`
      : isSelected
        ? `0 0 15px ${borderColor}`
        : "none",
});
