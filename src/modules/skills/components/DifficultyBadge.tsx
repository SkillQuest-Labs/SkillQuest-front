import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "Facile" | "Moyen" | "Difficile";
  className?: string;
}

const difficultyConfig = {
  Facile: {
    icon: "🟢",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  Moyen: {
    icon: "🟡",
    className:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  Difficile: {
    icon: "🔴",
    className:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium",
        config.className,
        className,
      )}
    >
      <span className="text-sm">{config.icon}</span>
      {difficulty}
    </Badge>
  );
}
