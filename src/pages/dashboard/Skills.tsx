import { useState, useMemo } from "react";
import { skillsMock } from "../../modules/skills/skills.const";
import type { SkillDifficulty, SkillSort, SkillStatus } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillGrid, SKILLS_PER_PAGE } from "../../modules/skills/components/SkillGrid";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Plus } from "lucide-react";
import { Pagination } from "../../modules/skills/components/Pagination";

export const Skills = () => {
  const { isCollapsed } = useSidebarStore();
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

  return (
    <div
      className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col min-h-0`}
    >
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-white">Mes Skills</h1>
        <button
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 focus:ring-2 focus:ring-blue-400 text-white font-medium px-3 py-1.5 rounded-md shadow-sm transition-all duration-150 text-sm"
          type="button"
        >
          <Plus size={18} />
          <span>Create a skill</span>
        </button>
      </div>
      <div className="flex-shrink-0">
        <SkillFilters
          difficulty={filters.difficulty}
          sort={filters.sort}
          status={filters.status}
          onFilterChange={setFilters}
        />
      </div>
      <div className="flex-1 min-h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 pt-6 pb-12">
        <SkillGrid skills={filteredSkills} page={page} setPage={setPage} />
      </div>
      <div className="flex-shrink-0 flex items-center justify-center">
        <Pagination page={page} setPage={setPage} totalPages={Math.ceil(filteredSkills.length / SKILLS_PER_PAGE)} />
      </div>
    </div>
  );
};
