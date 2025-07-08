import React, { useState, useMemo } from "react";
import { skillsMock } from "../../modules/skills/skills.const";
import { SkillDifficulty } from "../../modules/skills/skills.types";
import { SkillFilters } from "../../modules/skills/components/SkillFilters";
import { SkillGrid } from "../../modules/skills/components/SkillGrid";

export const Skills = () => {
  const [filters, setFilters] = useState<{ difficulty: SkillDifficulty | "all"; sort: "recent" | "oldest" }>({
    difficulty: "all",
    sort: "recent",
  });

  const filteredSkills = useMemo(() => {
    let result = [...skillsMock];
    if (filters.difficulty !== "all") {
      result = result.filter((s) => s.difficulty === filters.difficulty);
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
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Mes Skills</h1>
      <SkillFilters difficulty={filters.difficulty} sort={filters.sort} onFilterChange={setFilters} />
      <SkillGrid skills={filteredSkills} />
    </div>
  );
};
