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
  indigo: "from-indigo-500/25 via-violet-500/20 to-fuchsia-500/20",
  amber: "from-amber-400/25 via-orange-400/20 to-rose-400/20",
  rose: "from-rose-500/25 via-pink-500/20 to-purple-500/20",
};

export const FortniteStatCard = ({ title, value, icon: Icon, gradient = "indigo", className, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative text-left rounded-2xl p-5 lg:p-6",
        "bg-gradient-to-br border border-white/10",
        GRADIENTS[gradient],
        "backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        "hover:brightness-110 hover:-translate-y-1 transition-all duration-300",
        "min-h-[130px] lg:min-h-[150px] overflow-hidden",
        className,
      )}
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute -inset-24 bg-gradient-to-r from-white/10 via-white/5 to-transparent blur-2xl" />

      {/* contenu */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-slate-200/80 text-sm">{title}</p>
          <p className="mt-1 lg:mt-2 text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>

        {/* bulle icône */}
        <div className="shrink-0 p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* base highlight */}
      <div className="absolute inset-x-2 bottom-2 h-10 rounded-xl bg-white/5 blur-md" />
    </button>
  );
};
