import { useMemo } from "react";
import type { QuestCompletionMetric } from "../types/stats.types";

type FilteredMetricsProps = {
  metrics: QuestCompletionMetric[];
  searchTerm: string;
  filterStatus: "all" | "completed" | "in_progress";
  completionRange: number[];
};

export const useFilteredMetrics = ({
  metrics,
  searchTerm,
  filterStatus,
  completionRange,
}: FilteredMetricsProps): QuestCompletionMetric[] => {
  return useMemo(() => {
    return metrics.filter((metric) => {
      const percentage = metric.totalQuests > 0 ? (metric.completedQuests / metric.totalQuests) * 100 : 0;

      const matchesSearch = metric.skillName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "completed"
          ? percentage === 100
          : filterStatus === "in_progress"
            ? percentage > 0 && percentage < 100
            : true;

      const matchesRange = percentage >= completionRange[0] && percentage <= completionRange[1];

      return matchesSearch && matchesStatus && matchesRange;
    });
  }, [metrics, searchTerm, filterStatus, completionRange]);
};
