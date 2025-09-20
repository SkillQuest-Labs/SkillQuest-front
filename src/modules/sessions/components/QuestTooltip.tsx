import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { BookOpen } from "lucide-react";
import type { Session } from "@/shared/services/session/api-session.type";

type QuestTooltipProps = {
  session: Session;
  children: React.ReactNode;
};

export const QuestTooltip = ({ session, children }: QuestTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600/50 shadow-xl backdrop-blur-sm"
          sideOffset={8}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-100 mb-3 text-sm">
              <BookOpen className="h-4 w-4 text-blue-400" />
              Quêtes associées
            </div>
            <div className="space-y-1.5">
              {session.quests.map((quest, index) => (
                <div
                  key={quest.id || index}
                  className="flex items-start gap-2 text-slate-300 text-xs bg-slate-700/30 rounded-md px-2 py-1.5 border border-slate-600/30"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                  <span className="leading-relaxed">{quest.quest?.title || quest.title}</span>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
