import type { Skill } from "../skills.types";
import "../skills.css";
import { difficultyColors, statusColors, statusLabels } from "../skills.const";

type SkillCardProps = {
  skill: Skill;
};

export const SkillCard = ({ skill }: SkillCardProps) => (
  <div className="skill-card-custom group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[220px] p-0 overflow-hidden">
    {skill.image && (
      <div className="relative w-full h-28">
        <img
          src={skill.image}
          alt={skill.title}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10"
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        />
      </div>
    )}
    <div className="p-5 flex flex-col flex-1">
      <div className="flex items-start justify-between mb-2 min-w-0">
        <h3 className="font-semibold text-lg truncate max-w-[70%]" title={skill.title}>
          {skill.title}
        </h3>
        <div className="flex flex-col items-end gap-2 min-w-0">
          <span className={`skill-badge-difficulty ${difficultyColors[skill.difficulty]} whitespace-nowrap`}>
            {skill.difficulty === "easy" ? "Facile" : skill.difficulty === "medium" ? "Moyen" : "Difficile"}
          </span>
          <span className={`skill-badge-difficulty ${statusColors[skill.status]} whitespace-nowrap`}>
            {statusLabels[skill.status]}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-3 line-clamp-3" title={skill.description}>
        {skill.description}
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 text-xs text-gray-400">
        <span className="font-medium text-gray-500">{skill.category}</span>
        <span className="text-gray-300">{new Date(skill.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);
