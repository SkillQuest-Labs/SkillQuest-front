import { SkillCard } from "./SkillCard";
import "../../../styles/skills.css";
import { SKILLS_PER_PAGE } from "../skills.const";
import type { Skill } from "@/shared/types/skill.type";

// Props modifiées : page et setPage sont passés par le parent
export type SkillGridProps = {
  skills: Skill[];
  page: number;
  setPage: (page: number) => void;
};

export const SkillGrid = ({ skills, page }: SkillGridProps) => {
  const startIdx = (page - 1) * SKILLS_PER_PAGE;
  const paginatedSkills = skills.slice(startIdx, startIdx + SKILLS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8 overflow-visible px-2 md:px-4">
        {paginatedSkills.map((skill) => (
          <div key={skill.id} className="w-full max-w-[360px] mx-auto">
            <SkillCard skill={skill} />
          </div>
        ))}
      </div>
    </div>
  );
};
