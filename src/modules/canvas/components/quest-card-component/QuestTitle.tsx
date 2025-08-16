import { cn } from "@/shared/utils/helpers";
import { EyeIcon } from "lucide-react";

type QuestTitleProps = {
  title: string;
  onChange?: (value: string) => void;
};

export const QuestTitle = ({ title, onChange }: QuestTitleProps) => (
  <>
    <div className="absolute top-0 left-3 z-10">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-700/30 via-yellow-100/20 to-purple-900/30 flex items-center justify-center border-2 border-none  ring-2 ring-purple-100/40">
        <EyeIcon className="w-9 h-9 text-purple-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
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
