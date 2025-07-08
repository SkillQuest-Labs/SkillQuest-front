import React from "react";
import type { Skill } from "../skills.types";
import { SkillDifficulty, SkillStatus } from "../skills.types";
import "../skills.css";

interface SkillCardProps {
  skill: Skill;
}

const difficultyColors = {
  [SkillDifficulty.Easy]: "bg-green-100 text-green-800",
  [SkillDifficulty.Medium]: "bg-yellow-100 text-yellow-800",
  [SkillDifficulty.Hard]: "bg-red-100 text-red-800",
};

const statusColors = {
  [SkillStatus.Draft]: "bg-gray-200 text-gray-700",
  [SkillStatus.InProgress]: "bg-blue-100 text-blue-700",
  [SkillStatus.NotStarted]: "bg-yellow-100 text-yellow-700",
  [SkillStatus.Finished]: "bg-green-100 text-green-700",
};

const statusLabels = {
  [SkillStatus.Draft]: "Draft",
  [SkillStatus.InProgress]: "In progress",
  [SkillStatus.NotStarted]: "Not started",
  [SkillStatus.Finished]: "Finished",
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => (
  <div className="skill-card-custom group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[220px] p-5">
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-semibold text-lg truncate max-w-[70%]" title={skill.title}>
        {skill.title}
      </h3>
      <div className="flex flex-col items-end gap-2">
        <span className={`skill-badge-difficulty ${difficultyColors[skill.difficulty]}`}>
          {skill.difficulty === SkillDifficulty.Easy
            ? "Facile"
            : skill.difficulty === SkillDifficulty.Medium
              ? "Moyen"
              : "Difficile"}
        </span>
        <span className={`skill-badge-difficulty ${statusColors[skill.status]}`}>{statusLabels[skill.status]}</span>
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
);
