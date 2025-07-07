import { cn } from "../../../shared/utils/helpers";
import type { Skill } from "../skills.type";
import { statCards } from "../skills.const";

type StatsKeys = "total" | "completed" | "inProgress" | "notStarted" | "draft" | "averageProgress";

type SkillsStatsProps = {
  skills: Skill[];
  className?: string;
};

export function SkillsStats({ skills, className }: SkillsStatsProps) {
  const stats: Record<StatsKeys, number> = {
    total: skills.length,
    completed: skills.filter((s) => s.status === "completed").length,
    inProgress: skills.filter((s) => s.status === "in_progress").length,
    notStarted: skills.filter((s) => s.status === "not_started").length,
    draft: skills.filter((s) => s.status === "draft").length,
    averageProgress:
      skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + (skill.progress || 0), 0) / skills.length) : 0,
  };

  return (
    <div className={cn("grid grid-cols-3 md:grid-cols-6 gap-2", className)}>
      {statCards.map((stat, index) => (
        <div key={index} className="text-center p-2 rounded-md border bg-card/50">
          <div className={cn("text-sm mb-1", stat.color)}>{stat.icon}</div>
          <div className="text-sm font-semibold text-foreground">
            {stat.key === "averageProgress" ? `${stats[stat.key as StatsKeys]}%` : stats[stat.key as StatsKeys]}
          </div>
          <div className="text-xs text-muted-foreground">{stat.title}</div>
        </div>
      ))}
    </div>
  );
}
