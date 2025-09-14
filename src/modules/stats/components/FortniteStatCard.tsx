import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/helpers";

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  gradient?: "indigo" | "amber" | "rose";
  className?: string;
  onClick?: () => void;
};

const GRADIENTS: Record<NonNullable<Props["gradient"]>, string> = {
  indigo: "from-slate-900/90 via-blue-900/40 to-violet-900/30",
  amber: "from-slate-900/90 via-cyan-900/40 to-blue-900/30",
  rose: "from-slate-900/90 via-violet-900/40 to-indigo-900/30",
};

export const FortniteStatCard = ({ title, value, icon: Icon, gradient = "indigo", className, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative text-left rounded-2xl p-4 lg:p-5",
        "bg-gradient-to-br border border-blue-500/20",
        GRADIENTS[gradient],
        "backdrop-blur-md shadow-[0_10px_30px_rgba(59,130,246,0.15)]",
        "hover:border-blue-400/30 hover:-translate-y-1 transition-all duration-300",
        "min-h-[100px] lg:min-h-[120px] overflow-hidden",
        className,
      )}
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute -inset-24 bg-gradient-to-r from-blue-400/10 via-cyan-400/5 to-transparent blur-2xl" />

      {/* contenu */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-blue-200/80 text-xs lg:text-sm">{title}</p>
          <p className="mt-1 lg:mt-2 text-xl lg:text-2xl font-extrabold text-blue-50 tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>

        {/* bulle icône */}
        <div className="shrink-0 p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 backdrop-blur">
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-blue-100" />
        </div>
      </div>

      {/* base highlight */}
      <div className="absolute inset-x-2 bottom-2 h-10 rounded-xl bg-cyan-400/10 blur-md" />
    </button>
  );
};
