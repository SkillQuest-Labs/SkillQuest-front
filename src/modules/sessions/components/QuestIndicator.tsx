import { BookOpen } from "lucide-react";
import type { Session } from "@/shared/services/session/api-session.type";
import { QuestTooltip } from "./QuestTooltip";

type QuestIndicatorProps = {
  session: Session;
};

export const QuestIndicator = ({ session }: QuestIndicatorProps) => {
  const totalQuests = session.quests.length;

  return (
    <QuestTooltip session={session}>
      <div className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-2 py-1 text-xs cursor-pointer hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200 flex-shrink-0 border border-blue-500/20 hover:border-blue-400/40">
        <BookOpen className="h-3.5 w-3.5 text-blue-400" />
        <span className="text-blue-400 font-semibold">{totalQuests}</span>
      </div>
    </QuestTooltip>
  );
};
