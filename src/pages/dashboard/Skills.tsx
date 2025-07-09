import { useState, useMemo } from "react";
import { skillsMock } from "../../modules/skills/skills.const";
import type { SkillDifficulty, SkillSort, SkillStatus } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillGrid, SKILLS_PER_PAGE } from "../../modules/skills/components/SkillGrid";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "../../styles/skills.css";

function Pagination({ page, setPage, totalPages }: { page: number; setPage: (p: number) => void; totalPages: number }) {
  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              num === page
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
            }`}
            onClick={() => setPage(num)}
            aria-current={num === page ? "page" : undefined}
            aria-label={`Page ${num}`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export const Skills = () => {
  const [filters, setFilters] = useState<{
    difficulty: SkillDifficulty;
    sort: SkillSort;
    status: SkillStatus;
  }>({
    difficulty: "all",
    sort: "recent",
    status: "all",
  });
  const [page, setPage] = useState(1);

  const filteredSkills = useMemo(() => {
    let result = [...skillsMock];
    if (filters.difficulty !== "all") {
      result = result.filter((s) => s.difficulty === filters.difficulty);
    }
    if (filters.status !== "all") {
      result = result.filter((s) => s.status === filters.status);
    }
    result.sort((a, b) => {
      if (filters.sort === "recent") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
    return result;
  }, [filters]);

  const totalPages = Math.ceil(filteredSkills.length / SKILLS_PER_PAGE);

  // Reset page when filters change
  const handleFilterChange = (newFilters: { difficulty: SkillDifficulty; sort: SkillSort; status: SkillStatus }) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-4 max-w-7xl flex flex-col h-full">
        {/* Header - Fixed */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mes Skills</h1>
            <p className="text-slate-400 text-sm">
              {filteredSkills.length} skill{filteredSkills.length > 1 ? "s" : ""} trouvé
              {filteredSkills.length > 1 ? "s" : ""}
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-white font-medium px-4 py-2.5 rounded-lg shadow-lg transition-all duration-200 text-sm"
            type="button"
            aria-label="Créer une nouvelle skill"
          >
            <Plus size={18} />
            <span>Créer une skill</span>
          </button>
        </div>

        {/* Filters - Fixed */}
        <div className="mb-4 flex-shrink-0">
          <SkillFilters
            difficulty={filters.difficulty}
            sort={filters.sort}
            status={filters.status}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Skills Grid - Scrollable */}
        <div
          className="flex-1 overflow-y-auto scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <SkillGrid skills={filteredSkills} page={page} setPage={setPage} />
        </div>

        {/* Pagination - Fixed */}
        <div className="flex-shrink-0 mt-4">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};
