import { Badge } from "@/shared/components/ui/badge";
import { cn } from "../../../shared/utils/helpers";
import { statusConfig } from "../skills.const";

export enum Status {
  NotStarted = "not_started",
  InProgress = "in_progress",
  Completed = "completed",
  Draft = "draft",
}

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium", config.className, className)}
    >
      <span className="text-sm">{config.icon}</span>
      {config.label}
    </Badge>
  );
};
