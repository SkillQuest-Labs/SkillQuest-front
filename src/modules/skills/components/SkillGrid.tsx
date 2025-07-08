import React, { useState } from "react";
import type { Skill } from "../skills.types";
import { SkillCard } from "./SkillCard";
import "../skills.css";

interface SkillGridProps {
  skills: Skill[];
}

const SKILLS_PER_PAGE = 12;

export const SkillGrid: React.FC<SkillGridProps> = ({ skills }) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(skills.length / SKILLS_PER_PAGE);
  const startIdx = (page - 1) * SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIdx, startIdx + SKILLS_PER_PAGE);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Générer la liste des pages (1, 2, 3, ...)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 grid-rows-3 gap-6 mb-6">
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
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13 15L8 10L13 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 5L12 10L7 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
