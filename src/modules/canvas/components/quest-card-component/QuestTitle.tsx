import { cn } from "@/shared/utils/helpers";
import { Zap } from "lucide-react";

type QuestTitleProps = {
  title: string;
  onChange?: (value: string) => void;
};

export const QuestTitle = ({ title, onChange }: QuestTitleProps) => (
  <>
    <div className="absolute top-0 left-4 z-10">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 flex items-center justify-center shadow-[0_2px_12px_2px_rgba(255,215,0,0.25)] border-4 border-yellow-200/80 ring-2 ring-yellow-100/40">
        <Zap className="w-7 h-7 text-yellow-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      </div>
    </div>
    <div className="text-center mt-3 mb-8 relative z-10">
      <div className="relative">
        <textarea
          value={title}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Nom de la quête"
          className={cn(
            "text-2xl text-yellow-100 tracking-wide font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] bg-transparent border-none text-center w-full outline-none focus:ring-0",
            "h-20 max-h-20 px-2 py-2",
            "resize-none overflow-hidden",
            "break-words",
            "leading-tight",
          )}
          onClick={(e) => e.stopPropagation()}
          maxLength={120}
          spellCheck={true}
          title={title}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
        />
      </div>
    </div>
  </>
);
