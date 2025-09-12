import { Button } from "@/shared/components/ui/button";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { useUser } from "@clerk/clerk-react";
import { ChevronLeft, ChevronRight, Filter, Grid, List, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { buildQuestCompletionData, filterStatusOptions, questCompletionRange } from "./quest-completion-chart.const";
import { ProgressBar } from "./ProgressBar";
import { useFilteredMetrics } from "@/modules/stats/hooks/use-quest-completion";
import type { QuestCompletionMetric } from "@/modules/stats/types/stats.types";

type FilterStatus = "all" | "completed" | "in_progress";
type ViewMode = "grid" | "compact";

type TooltipData = {
  metric: QuestCompletionMetric;
  level: number;
  currentIcon: string;
  position: { x: number; y: number };
};

export const QuestCompletionChart = () => {
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [completionRange, setCompletionRange] = useState([0, 100]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<"bottom" | "top">("bottom");

  const questCompletionMetrics = buildQuestCompletionData(skillsData);

  const filteredAndSortedMetrics = useFilteredMetrics({
    metrics: questCompletionMetrics,
    searchTerm,
    filterStatus,
    completionRange,
  });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedMetrics.length / itemsPerPage);
  const paginatedMetrics = filteredAndSortedMetrics.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, completionRange]);

  const handleTooltipShow = (data: TooltipData) => {
    setTooltipData(data);

    // Determine tooltip position based on available space
    const spaceBottom = window.innerHeight - data.position.y;
    setTooltipPosition(spaceBottom < 200 ? "top" : "bottom");
  };

  const handleTooltipHide = () => {
    setTooltipData(null);
  };

  return (
    <div className="p-2 w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-600/30">
      <div className="flex-shrink-0 text-center p-2 ">
        <h3 className="text-xl font-bold text-white mb-2">Progression des Quêtes par Compétence</h3>
      </div>

      {/* filtre container */}
      <div className="px-4 pb-4 h-[25%] flex-shrink-0">
        <div className="space-y-3">
          <div className="flex flex-row gap-3 py-4 items-center justify-between">
            <div className="relative w-[35%]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center justify-center w-[55%]">
              <div className="inline-flex p-1 bg-slate-800/30 rounded-xl">
                {filterStatusOptions.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key as FilterStatus)}
                    className={`relative flex items-center gap-1.5 px-4 py-1.5 text-xm font-medium rounded-lg transition-all duration-500 ${
                      filterStatus === key
                        ? "text-white before:absolute before:inset-0 before:bg-blue-500/20 before:rounded-lg before:animate-pulse"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className={`${filterStatus === key ? "text-blue-400" : "text-slate-500"}`}>{icon}</span>
                    <span>{label}</span>
                    {filterStatus === key && (
                      <span className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-blue-500 transform -translate-x-1/2 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="w-[10%] flex justify-center">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-600/30">
                <Button
                  variant="ghost"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode("compact")}
                  className={`p-2 rounded-md transition-all duration-300 ${
                    viewMode === "compact"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Completion Range Segments */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400 flex items-center gap-2 opacity-80">
              <Filter className="w-3.5 h-3.5" />
              <span className="opacity-90">Filtrer par niveau de progression</span>
            </label>
            <div className="flex items-center gap-1.5 px-2">
              {questCompletionRange.map((segment, index) => {
                const isActive = completionRange[0] === segment.min && completionRange[1] === segment.max;
                const isPartiallyActive =
                  (completionRange[0] >= segment.min && completionRange[0] < segment.max) ||
                  (completionRange[1] > segment.min && completionRange[1] <= segment.max) ||
                  (completionRange[0] < segment.min && completionRange[1] > segment.max);

                return (
                  <button
                    key={index}
                    onClick={() => setCompletionRange([segment.min, segment.max])}
                    className={`relative ${segment.width} cursor-pointer h-8 rounded-lg border transition-all duration-500 transform hover:scale-102 group overflow-hidden ${
                      isActive
                        ? `border-slate-500/30 bg-gradient-to-br ${segment.activeColor} shadow-sm`
                        : isPartiallyActive
                          ? `border-slate-600/20 bg-gradient-to-br ${segment.color} hover:border-slate-500/30`
                          : "border-slate-600/20 bg-gradient-to-br from-slate-800/20 to-slate-700/10 hover:border-slate-500/30"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
                      <div
                        className={`text-xs font-medium transition-colors duration-300 ${
                          isActive ? "text-slate-200" : isPartiallyActive ? "text-slate-300" : "text-slate-400"
                        }`}
                      >
                        {segment.label}
                      </div>
                    </div>

                    {isActive && (
                      <div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${segment.activeColor} opacity-10 animate-pulse`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars Container */}
      <div className="mt-5 overflow-y-auto px-4  h-[65%] flex-shrink-0">
        {paginatedMetrics.length > 0 ? (
          <div
            className={` ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 justify-items-center pb-4"
                : "space-y-3 pb-4"
            } transition-all duration-500`}
          >
            {paginatedMetrics.map((metric, index) => (
              <ProgressBar
                key={metric.skillId}
                metric={metric}
                index={index}
                viewMode={viewMode}
                onTooltipShow={handleTooltipShow}
                onTooltipHide={handleTooltipHide}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-slate-400 h-full min-h-48">
            <div className="text-center">
              <div className="text-4xl mb-2">🔍</div>
              <div>Aucune compétence ne correspond aux filtres</div>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setCompletionRange([0, 100]);
                }}
                className="mt-4 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="h-auto flex-shrink-0 flex items-center justify-center gap-2 p-4 pt-2">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 cursor-pointer rounded-lg bg-slate-800/50 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                variant="ghost"
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`cursor-pointer px-3 py-2 rounded-lg border transition-all duration-300 ${
                  currentPage === pageNum
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-800/50 border-slate-600/30 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 cursor-pointer rounded-lg bg-slate-800/50 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Centralized Tooltip */}
      {tooltipData && (
        <div
          className="fixed bg-slate-900/95 border border-slate-600/50 rounded-lg p-3 text-sm text-white shadow-xl z-50 min-w-48 pointer-events-none"
          style={{
            left: `${tooltipData.position.x}px`,
            transform: "translateX(-50%)",
            [tooltipPosition === "bottom" ? "top" : "bottom"]:
              tooltipPosition === "bottom"
                ? `${tooltipData.position.y + 10}px`
                : `${window.innerHeight - tooltipData.position.y + 10}px`,
          }}
        >
          <div className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
            <span className="text-xl">{tooltipData.currentIcon}</span>
            {tooltipData.metric.skillName}
            <span className="ml-auto text-blue-300 font-bold">Lv. {tooltipData.level}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-blue-400">Complétées:</span>
              <span className="font-medium">{tooltipData.metric.completedQuests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Restantes:</span>
              <span className="font-medium">{tooltipData.metric.remainingQuests}</span>
            </div>
            <div className="flex justify-between border-t border-slate-600/50 pt-1">
              <span className="text-slate-300">Total:</span>
              <span className="font-medium">{tooltipData.metric.totalQuests}</span>
            </div>
          </div>
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-transparent ${
              tooltipPosition === "bottom"
                ? "bottom-full border-t-4 border-t-slate-900/95"
                : "top-full border-b-4 border-b-slate-900/95"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};
