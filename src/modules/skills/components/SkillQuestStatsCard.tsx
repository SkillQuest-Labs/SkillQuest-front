import { cn } from "@/shared/utils/helpers";
import { CheckCircle2, Lock, Sparkles, Unlock } from "lucide-react";
import React from "react";

export type SkillQuestStats = {
  total: number;
  completed: number;
  available: number;
  locked: number;
};

type SkillQuestStatsCardProps = {
  stats: SkillQuestStats;
  className?: string;
};

const entries = (
  stats: SkillQuestStats,
): Array<{
  key: keyof SkillQuestStats;
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  description: string;
}> => [
  {
    key: "total",
    label: "Quêtes",
    value: stats.total,
    icon: <Sparkles className="h-4 w-4 text-slate-200" />,
    accent: "from-cyan-400/25 to-sky-500/10",
    description: "Total des étapes rattachées au skill",
  },
  {
    key: "completed",
    label: "Terminées",
    value: stats.completed,
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" />,
    accent: "from-emerald-400/25 to-emerald-500/10",
    description: "Quêtes validées définitivement",
  },
  {
    key: "available",
    label: "Disponibles",
    value: stats.available,
    icon: <Unlock className="h-4 w-4 text-sky-200" />,
    accent: "from-sky-400/25 to-sky-500/10",
    description: "Prêtes à être lancées",
  },
  {
    key: "locked",
    label: "Bloquées",
    value: stats.locked,
    icon: <Lock className="h-4 w-4 text-rose-200" />,
    accent: "from-rose-500/25 to-rose-500/10",
    description: "Encore verrouillées par des prérequis",
  },
];

export const SkillQuestStatsCard = ({ stats, className }: SkillQuestStatsCardProps) => {
  const items = entries(stats);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/35 p-5 shadow-[0_25px_80px_-60px_rgba(15,23,42,0.85)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(129,140,248,0.14),transparent_60%)]" />

      <div className="relative flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Parcours du skill</h3>
          <p className="text-xs text-slate-500">Vision rapide des quêtes liées</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-slate-300">
          {stats.total} total
        </span>
      </div>

      <ul className="relative mt-5 space-y-3">
        {items.map(({ key, label, value, icon, accent, description }) => (
          <li
            key={key}
            className="relative flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left text-slate-100 shadow-[0_20px_70px_-60px_rgba(15,23,42,0.9)]"
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br",
                accent,
              )}
            >
              {icon}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-100">{label}</span>
                <span className="text-lg font-semibold text-slate-50">{value}</span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
