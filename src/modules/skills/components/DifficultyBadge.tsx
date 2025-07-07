import { Badge } from "@/shared/components/ui/badge";
import { cn } from "../../../shared/utils/helpers";
import { difficultyConfig } from "../skills.const";
import type { Difficulty } from "../skills.type";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const DifficultyBadge = ({ difficulty, className }: DifficultyBadgeProps) => {
  const config = difficultyConfig[difficulty];

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium", config.className, className)}
    >
      <span className="text-sm">{config.icon}</span>
      {difficulty}
    </Badge>
  );
};

export { DifficultyBadge };
