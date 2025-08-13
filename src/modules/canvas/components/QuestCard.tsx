import type { QuestCardProps } from "../canvas.type";
import { QuestCardBorderSVG } from "./animations/QuestCardBorderSVG";
import { QuestDescription, QuestTitle, DeleteButton, QuestConnectionCount } from "./quest-card-component";

export const QuestCard = ({ data, onDelete, sourceHandle, targetHandle, isCollapsed = false }: QuestCardProps) => {
  return (
    <>
      {sourceHandle}
      {targetHandle}

      <QuestCardBorderSVG />

      <DeleteButton onDelete={onDelete} />

      <QuestTitle title={data.title} onChange={(value) => data.onUpdate?.("title", value)} />

      <div
        className={`transition-all duration-300 overflow-y-auto ${
          isCollapsed ? "max-h-0 opacity-0" : "max-h-[560px] opacity-100"
        }`}
      >
        <QuestConnectionCount />

        <QuestDescription description={data.description} onChange={(value) => data.onUpdate?.("description", value)} />
      </div>
    </>
  );
};
