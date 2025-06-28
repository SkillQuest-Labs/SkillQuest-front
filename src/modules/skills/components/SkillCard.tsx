import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { DifficultyBadge } from "./DifficultyBadge";
import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/shared/lib/utils";
import type { Skill } from "../skills.type";

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SkillCard({
  skill,
  onClick,
  className,
  style,
}: SkillCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-md cursor-pointer",
        className,
      )}
      onClick={onClick}
      style={style}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
              {skill.title}
            </h3>
            {skill.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {skill.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <DifficultyBadge difficulty={skill.difficulty} />
            <StatusBadge status={skill.status} />
          </div>
        </div>

        {/* Progress Section */}
        {skill.progress !== undefined && (
          <div className="space-y-2">
            <ProgressBar progress={skill.progress} showLabel={false} />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Progression: {skill.progress}%</span>
              {skill.questsCount && (
                <span className="flex items-center gap-1">
                  <span>🎯</span>
                  {skill.questsCount} quêtes
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              {formatDuration(skill.duration)}
            </span>
            {skill.category && (
              <span className="flex items-center gap-1">
                <span>📁</span>
                {skill.category}
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Mis à jour le {formatDate(skill.updatedAt)}
          </div>
        </div>

        {/* Hover effect button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Button size="sm" variant="outline" className="h-8 px-3">
            Voir détails →
          </Button>
        </div>
      </div>
    </Card>
  );
}
