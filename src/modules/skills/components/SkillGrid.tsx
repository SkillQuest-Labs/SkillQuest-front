import { SkillCard } from "./SkillCard";
import type { Skill } from "../skills.types";

// Props modifiées : page et setPage sont passés par le parent
export type SkillGridProps = {
  skills: Skill[];
  page: number;
  setPage: (page: number) => void;
};

export const SKILLS_PER_PAGE = 8;

export const SkillGrid = ({ skills, page }: SkillGridProps) => {
  const startIdx = (page - 1) * SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIdx, startIdx + SKILLS_PER_PAGE);

  if (paginatedSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Aucune skill trouvée</h3>
        <p className="text-slate-400 max-w-md">
          Aucune skill ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedSkills.map((skill) => (
          <div key={skill.id} className="w-full">
            <SkillCard skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
};
