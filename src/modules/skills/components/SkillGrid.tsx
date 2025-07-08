import React, { useState } from "react";
import type { Skill } from "../skills.types";
import { SkillCard } from "./SkillCard";

interface SkillGridProps {
  skills: Skill[];
}

const SKILLS_PER_PAGE = 16;

export const SkillGrid: React.FC<SkillGridProps> = ({ skills }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(skills.length / SKILLS_PER_PAGE);
  const startIdx = (page - 1) * SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIdx, startIdx + SKILLS_PER_PAGE);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 grid-rows-4 gap-6 mb-6">
        {paginatedSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          ←
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          →
        </button>
      </div>
    </div>
  );
};
