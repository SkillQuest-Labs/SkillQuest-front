import { cn } from "@/shared/utils/helpers";
import { Zap } from "lucide-react";

type QuestTitleProps = {
  title: string;
  onChange?: (value: string) => void;
};

export const QuestTitle = ({ title, onChange }: QuestTitleProps) => (
  <>
    <div className="absolute top-4 left-4 z-10">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 flex items-center justify-center shadow-[0_2px_12px_2px_rgba(255,215,0,0.25)] border-4 border-yellow-200/80 ring-2 ring-yellow-100/40">
        <Zap className="w-7 h-7 text-yellow-900 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
      </div>
    </div>
    <div className="text-center mt-8 mb-8 relative z-10">
      <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-[0_2px_8px_rgba(255,255,0,0.25)] tracking-widest font-serif uppercase">
        QUEST
      </h1>
      <div className="relative mt-1">
        <input
          type="text"
          value={title}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Quest Title"
          className={cn(
            "text-2xl text-yellow-100 tracking-wide font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] bg-transparent border-none text-center w-full outline-none focus:ring-0",
            "max-h-24 min-h-10 px-2 py-1",
            "overflow-x-auto overflow-y-auto",
            "break-words",
            "w-[95%]"
          )}
          onClick={(e) => e.stopPropagation()}
          maxLength={120}
          spellCheck={true}
          title={title}
        />
      </div>
    </div>
  </>
);
