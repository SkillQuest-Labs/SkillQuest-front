import { useState, useMemo } from "react";
import type { SkillDifficulty, SkillSort, SkillStatus } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillGrid } from "../../modules/skills/components/SkillGrid";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { Plus } from "lucide-react";
import { Pagination } from "../../modules/skills/components/Pagination";
import { useNavigate } from "react-router-dom";
import { useCanvasStore } from "@/stores/canvas/canvas-store";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { SKILLS_PER_PAGE } from "@/modules/skills/skills.const";

export const Skills = () => {
  const { isCollapsed } = useSidebarStore();
  const { skills: skillsData } = useGetSkills("uuid-user-1234-5678-9012-345678901111");
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    difficulty: SkillDifficulty;
    sort: SkillSort;
    status: SkillStatus;
  }>({
    difficulty: "ALL",
    sort: "RECENT",
    status: "ALL",
  });
  const [page, setPage] = useState(1);

  const filteredSkills = useMemo(() => {
    if (!skillsData || !Array.isArray(skillsData)) return [];

    let result = [...skillsData];

    if (filters.difficulty && filters.difficulty.toUpperCase() !== "ALL") {
      result = result.filter((s) => s.difficulty === filters.difficulty);
    }

    if (filters.status && filters.status.toUpperCase() !== "ALL") {
      result = result.filter((s) => s.status === filters.status);
    }

    // result.sort((a, b) => {
    //   if (filters.sort === "RECENT") {
    //     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    //   } else {
    //     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    //   }
    // });

    return result;
  }, [filters, skillsData]);

  const reset = useCanvasStore((state) => state.reset);

  const handleCreateNewSkill = () => {
    reset();
    navigate("/canvas?createSkill=true");
  };

  return (
    <div
      className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col min-h-0`}
    >
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes Skills</h1>
          {/* <p className="text-slate-400 text-sm mt-1">{skillsData && skillsData.length} skills au total</p> */}
        </div>
        <button
          className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 focus:ring-2 focus:ring-blue-400 text-white font-medium px-3 py-1.5 rounded-md shadow-sm transition-all duration-150 text-sm"
          type="button"
          onClick={handleCreateNewSkill}
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
