import { cn } from "@/shared/lib/utils";
import type { Skill } from "../skills.type";

interface SkillsStatsProps {
  skills: Skill[];
  className?: string;
}

export function SkillsStats({ skills, className }: SkillsStatsProps) {
  const stats = {
    total: skills.length,
    completed: skills.filter((s) => s.status === "completed").length,
    inProgress: skills.filter((s) => s.status === "in_progress").length,
    notStarted: skills.filter((s) => s.status === "not_started").length,
    draft: skills.filter((s) => s.status === "draft").length,
    averageProgress:
      skills.length > 0
        ? Math.round(
            skills.reduce((acc, skill) => acc + (skill.progress || 0), 0) /
              skills.length,
          )
        : 0,
  };

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: "🎯",
      color: "text-blue-600",
    },
    {
      title: "Terminés",
      value: stats.completed,
      icon: "✅",
      color: "text-green-600",
    },
    {
      title: "En cours",
      value: stats.inProgress,
      icon: "🚀",
      color: "text-purple-600",
    },
    {
      title: "Non commencés",
      value: stats.notStarted,
      icon: "⏳",
      color: "text-gray-600",
    },
    {
      title: "Brouillons",
      value: stats.draft,
      icon: "📝",
      color: "text-orange-600",
    },
    {
      title: "Progression moy.",
      value: `${stats.averageProgress}%`,
      icon: "📊",
      color: "text-indigo-600",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-3 md:grid-cols-6 gap-2",
        className,
      )}
    >
      {statCards.map((stat, index) => (
        <div key={index} className="text-center p-2 rounded-md border bg-card/50">
          <div className={cn("text-sm mb-1", stat.color)}>{stat.icon}</div>
          <div className="text-sm font-semibold text-foreground">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.title}</div>
        </div>
      ))}
    </div>
  );
}
