import { useState, useMemo } from "react";
import type { FilterSkillDifficulty, FilterSkillStatus, SkillSort } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillCard } from "../../modules/skills/components/SkillCard";
import { EmptySkills } from "../../modules/skills/components/EmptySkills";
import { useSidebarStore } from "@/stores/sidebar/sidebarStore";
import { ArrowLeft } from "lucide-react";
import { Pagination } from "../../modules/skills/components/Pagination";
import { useNavigate } from "react-router-dom";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import { SKILLS_PER_PAGE } from "@/modules/skills/skills.const";
import { useUser } from "@clerk/clerk-react";
import "@/styles/sessions-listing.css";

export const Skills = () => {
  const { isCollapsed } = useSidebarStore();
  const { user } = useUser();
  const userId = user?.id;
  const { skills: skillsData } = useGetSkills(userId || "");
  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    difficulty: FilterSkillDifficulty;
    sort: SkillSort;
    status: FilterSkillStatus;
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


  return (
    <div
      className={`p-4 md:p-8 min-h-screen h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-all duration-300 ${
        isCollapsed ? "pl-20" : "pl-64"
      } flex flex-col min-h-0`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <button onClick={() => navigate("/dashboard")} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Tous vos skills</h1>
          <p className="text-slate-400 text-sm mt-1">
            Consultez, éditez ou supprimez vos compétences et suivez votre progression.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <SkillFilters
        difficulty={filters.difficulty}
        sort={filters.sort}
        status={filters.status}
        onFilterChange={setFilters}
      />

      {/* Compteur de résultats */}
      <div className="text-sm text-slate-400 mb-4">
        {filteredSkills.length} résultat{filteredSkills.length > 1 ? "s" : ""} affiché
        {filteredSkills.length > 1 ? "s" : ""}.
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-h-0">
        {filteredSkills.length === 0 ? (
          <EmptySkills />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredSkills.length > 0 && (
        <div className="flex-shrink-0 flex items-center justify-center mt-6">
          <Pagination page={page} setPage={setPage} totalPages={Math.ceil(filteredSkills.length / SKILLS_PER_PAGE)} />
        </div>
      )}
    </div>
  );
};
