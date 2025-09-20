import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/helpers";

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
};

export const AccueilStatCard = ({ title, value, icon: Icon, className, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative text-left rounded-lg p-3",
        "bg-slate-800/60 border border-slate-600/40",
        "backdrop-blur-sm shadow-lg",
        "hover:border-slate-500/60 hover:bg-slate-700/60 hover:shadow-xl transition-all duration-300",
        "h-16 w-full overflow-hidden",
        "group",
        className,
      )}
    >
      {/* contenu */}
      <div className="relative z-10 flex items-center gap-3 h-full">
        <div className="p-1.5 rounded-lg bg-slate-700/60 border border-slate-600/50 flex-shrink-0 group-hover:bg-slate-600/60 transition-colors">
          <Icon className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-xs font-medium leading-tight truncate">{title}</p>
          <p className="text-slate-200 text-sm font-bold leading-tight truncate">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </button>
  );
};
