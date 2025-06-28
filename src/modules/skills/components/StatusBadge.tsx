import { Badge } from "@/shared/components/ui/badge";
import { cn } from "../../../shared/utils/helpers";

interface StatusBadgeProps {
  status: "not_started" | "in_progress" | "completed" | "draft";
  className?: string;
}

const statusConfig = {
  not_started: {
    icon: "⏳",
    label: "Non commencé",
    className:
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  },
  in_progress: {
    icon: "🚀",
    label: "En cours",
    className:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  completed: {
    icon: "✅",
    label: "Terminé",
    className:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  draft: {
    icon: "📝",
    label: "Brouillon",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

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
      {config.label}
    </Badge>
  );
}
