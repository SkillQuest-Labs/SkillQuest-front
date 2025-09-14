import type { SkillSort, FilterSkillDifficulty, FilterSkillStatus } from "../skills.types";
import { ChevronDown } from "lucide-react";

type SkillFiltersProps = {
  difficulty: FilterSkillDifficulty;
  sort: SkillSort;
  status: FilterSkillStatus;
  onFilterChange: (filters: { difficulty: FilterSkillDifficulty; sort: SkillSort; status: FilterSkillStatus }) => void;
};

export const SkillFilters = ({ difficulty, sort, status, onFilterChange }: SkillFiltersProps) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow p-3 mb-6">
      <div className="flex gap-2 items-end">
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Difficulté</label>
          <div className="relative">
            <select
              className="cursor-pointer appearance-none border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 pr-8 hover:border-blue-400"
              value={difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value as FilterSkillDifficulty, sort, status })}
            >
              <option value="All">All</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown color="white" />
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Statut</label>
          <div className="relative">
            <select
              className="cursor-pointer appearance-none border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 pr-8 hover:border-blue-400"
              value={status}
              onChange={(e) => onFilterChange({ difficulty, sort, status: e.target.value as FilterSkillStatus })}
            >
              <option value="ALL">All</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="NOT_STARTED">Not started</option>
              <option value="COMPLETED">Finished</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown color="white" />
            </span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-white">Trier par</label>
          <div className="relative">
            <select
              className="cursor-pointer appearance-none border border-slate-700 rounded-lg px-3 py-2 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 pr-8 hover:border-blue-400"
              value={sort}
              onChange={(e) => onFilterChange({ difficulty, sort: e.target.value as SkillSort, status })}
            >
              <option value="RECENT">Plus récent</option>
              <option value="OLDEST">Moins récent</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown color="white" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
