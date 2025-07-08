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

const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 8L10 12L14 8" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SkillFilters: React.FC<SkillFiltersProps> = ({ difficulty, sort, status, onFilterChange }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow p-3 mb-6">
      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Difficulté</label>
          <div className="relative">
            <select
              className="appearance-none border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 pr-8 hover:border-blue-400"
              value={difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value as SkillDifficulty | "all", sort, status })}
            >
              <option value="all">Toutes</option>
              <option value={SkillDifficulty.Easy}>Facile</option>
              <option value={SkillDifficulty.Medium}>Moyen</option>
              <option value={SkillDifficulty.Hard}>Difficile</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Statut</label>
          <div className="relative">
            <select
              className="appearance-none border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 pr-8 hover:border-blue-400"
              value={status}
              onChange={(e) => onFilterChange({ difficulty, sort, status: e.target.value as SkillStatus | "all" })}
            >
              <option value="all">All</option>
              <option value={SkillStatus.Draft}>Draft</option>
              <option value={SkillStatus.InProgress}>In progress</option>
              <option value={SkillStatus.NotStarted}>Not started</option>
              <option value={SkillStatus.Finished}>Finished</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Trier par</label>
          <div className="relative">
            <select
              className="appearance-none border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 pr-8 hover:border-blue-400"
              value={sort}
              onChange={(e) => onFilterChange({ difficulty, sort: e.target.value as "recent" | "oldest", status })}
            >
              <option value="recent">Plus récent</option>
              <option value="oldest">Moins récent</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
