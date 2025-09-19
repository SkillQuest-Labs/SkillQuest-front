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
        "relative text-left rounded-lg p-2",
        "bg-slate-800/50 border border-slate-600/30",
        "backdrop-blur-sm shadow-sm",
        "hover:border-slate-500/50 hover:bg-slate-700/50 transition-all duration-300",
        "h-16 w-full overflow-hidden",
        className,
      )}
    >
      {/* contenu */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 text-center h-full px-2">
        <div className="p-2 rounded-lg bg-slate-700/50 border border-slate-600/40">
          <Icon className="w-5 h-5 text-slate-300" />
        </div>
        <div className="w-full">
          <p className="text-slate-400 text-sm leading-tight">{title}</p>
          <p className="text-slate-200 text-base font-semibold">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>
    </button>
  );
};
