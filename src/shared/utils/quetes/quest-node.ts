import type { Node } from "@xyflow/react";
import type { QuestNodeData } from "@/modules/canvas/canvas.type";

export function createQuestNode(
  id: string,
  position: { x: number; y: number },
  removeNode: (id: string) => void,
  updateNodeData: (id: string, field: string, value: any) => void,
  questData?: Partial<QuestNodeData>,
): Node<QuestNodeData> {
  return {
    id,
    type: "questNode",
    position,
    data: {
      kind: "quest",
      title: questData?.title ?? "New Quest",
      description: questData?.description ?? "Quest description...",
      status: questData?.status ?? "LOCKED",
      isCollapsed: false,
      onDelete: (nid: string) => removeNode(nid),
      onUpdate: (field: string, value: any) => updateNodeData(id, field, value),
      onView: questData?.onView,
    },
  };
}
