import React, { useState, useMemo } from "react";
import { skillsMock } from "../../modules/skills/skills.const";
import { SkillDifficulty, SkillStatus } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillGrid } from "../../modules/skills/components/SkillGrid";

export const Skills = () => {
  const [filters, setFilters] = useState<{
    difficulty: SkillDifficulty | "all";
    sort: "recent" | "oldest";
    status: SkillStatus | "all";
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
    <div className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <h1 className="text-2xl font-bold mb-6 text-white">Mes Skills</h1>
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
