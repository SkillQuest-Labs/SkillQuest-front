import { useState, useMemo } from "react";
import { skillsMock } from "../../modules/skills/skills.const";
import type { SkillDifficulty, SkillSort, SkillStatus } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillGrid } from "../../modules/skills/components/SkillGrid";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";

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
      className={`p-4 md:p-8 min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 ${
        isCollapsed ? "pl-20" : "pl-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Mes Skills</h1>
        <button
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 focus:ring-2 focus:ring-blue-400 text-white font-medium px-3 py-1.5 rounded-md shadow-sm transition-all duration-150 text-sm"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Create a skill</span>
        </button>
      </div>
      <SkillFilters
        difficulty={filters.difficulty}
        sort={filters.sort}
        status={filters.status}
        onFilterChange={setFilters}
      />
      <SkillGrid skills={filteredSkills} />
    </div>
  );
};
