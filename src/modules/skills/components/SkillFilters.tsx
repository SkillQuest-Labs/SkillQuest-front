import React from "react";
import { SkillDifficulty, SkillStatus } from "../skills.types";

interface SkillFiltersProps {
  difficulty: SkillDifficulty | "all";
  sort: "recent" | "oldest";
  status: SkillStatus | "all";
  onFilterChange: (filters: {
    difficulty: SkillDifficulty | "all";
    sort: "recent" | "oldest";
    status: SkillStatus | "all";
  }) => void;
}

export const SkillFilters: React.FC<SkillFiltersProps> = ({ difficulty, sort, status, onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-6 items-end">
      <div>
        <label className="block text-xs font-medium mb-1">Difficulté</label>
        <select
          className="border rounded px-2 py-1"
          value={difficulty}
          onChange={(e) => onFilterChange({ difficulty: e.target.value as SkillDifficulty | "all", sort, status })}
        >
          <option value="all">Toutes</option>
          <option value={SkillDifficulty.Easy}>Facile</option>
          <option value={SkillDifficulty.Medium}>Moyen</option>
          <option value={SkillDifficulty.Hard}>Difficile</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Statut</label>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={(e) => onFilterChange({ difficulty, sort, status: e.target.value as SkillStatus | "all" })}
        >
          <option value="all">All</option>
          <option value={SkillStatus.Draft}>Draft</option>
          <option value={SkillStatus.InProgress}>In progress</option>
          <option value={SkillStatus.NotStarted}>Not started</option>
          <option value={SkillStatus.Finished}>Finished</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Trier par</label>
        <select
          className="border rounded px-2 py-1"
          value={sort}
          onChange={(e) => onFilterChange({ difficulty, sort: e.target.value as "recent" | "oldest", status })}
        >
          <option value="recent">Plus récent</option>
          <option value="oldest">Moins récent</option>
        </select>
      </div>
    </div>
  );
};
