import type { QuestCardProps } from "../canva.type";
import { QuestCardBorderSVG } from "./animations/QuestCardBorderSVG";
import {
  QuestDifficultySelector,
  QuestDescription,
  QuestXp,
  QuestTitle,
  DeleteButton,
} from "./quest-card-component";

export const QuestCard = ({
  data,
  onDelete,
  sourceHandle,
  targetHandle,
}: QuestCardProps) => {
  return (
    <>
      {sourceHandle}
      {targetHandle}

      <QuestCardBorderSVG />

      <DeleteButton onDelete={onDelete} />

      <QuestTitle
        title={data.title}
        onChange={(value) => data.onUpdate?.("title", value)}
      />
      <QuestXp xp={data.xp} />

      <QuestDifficultySelector
        value={data.difficulty}
        onChange={(value) => data.onUpdate?.("difficulty", value)}
      />
      <QuestDescription
        description={data.description}
        onChange={(value) => data.onUpdate?.("description", value)}
      />
    </>
  );
};
