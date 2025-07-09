import { useState } from "react";
import type { Skill } from "../skills.types";
import { SkillCard } from "./SkillCard";
import "../skills.css";
import { SKILLS_PER_PAGE } from "../skills.const";
import { ChevronLeftIcon } from "@/component/icons/chevron-left.icon";
import { ChevronRightIcon } from "@/component/icons/chevron-right.icon";

type SkillGridProps = {
  skills: Skill[];
};

export const SkillGrid = ({ skills }: SkillGridProps) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(skills.length / SKILLS_PER_PAGE);
  const startIdx = (page - 1) * SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIdx, startIdx + SKILLS_PER_PAGE);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Generate the list of pages (1, 2, 3, ...)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {paginatedSkills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      <div className="skill-pagination">
        <button
          className="skill-pagination-arrow"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
        >
          <ChevronLeftIcon />
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={`skill-pagination-btn${num === page ? " selected" : ""}`}
            onClick={() => goToPage(num)}
            aria-current={num === page ? "page" : undefined}
            aria-label={`Page ${num}`}
          >
            {num}
          </button>
        ))}
        <button
          className="skill-pagination-arrow"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          aria-label="Page suivante"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};
