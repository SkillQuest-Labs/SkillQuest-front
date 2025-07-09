import type { SkillDifficulty, SkillSort, SkillStatus } from "../skills.types";
import { ChevronDown, Filter } from "lucide-react";

type SkillFiltersProps = {
  difficulty: SkillDifficulty;
  sort: SkillSort;
  status: SkillStatus;
  onFilterChange: (filters: { difficulty: SkillDifficulty; sort: SkillSort; status: SkillStatus }) => void;
};

export const SkillFilters = ({ difficulty, sort, status, onFilterChange }: SkillFiltersProps) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter size={16} className="text-blue-400" />
        <h2 className="text-base font-semibold text-white">Filtres</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1 text-slate-200">Difficulté</label>
          <div className="relative">
            <select
              className="appearance-none w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8 hover:border-slate-500"
              value={difficulty}
              onChange={(e) => onFilterChange({ difficulty: e.target.value as SkillDifficulty | "all", sort, status })}
            >
              <option value="all">Toutes les difficultés</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown size={14} className="text-slate-400" />
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-slate-200">Statut</label>
          <div className="relative">
            <select
              className="appearance-none w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8 hover:border-slate-500"
              value={status}
              onChange={(e) => onFilterChange({ difficulty, sort, status: e.target.value as SkillStatus })}
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="in_progress">En cours</option>
              <option value="not_started">Non commencé</option>
              <option value="finished">Terminé</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown size={14} className="text-slate-400" />
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-slate-200">Trier par</label>
          <div className="relative">
            <select
              className="appearance-none w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8 hover:border-slate-500"
              value={sort}
              onChange={(e) => onFilterChange({ difficulty, sort: e.target.value as SkillSort, status })}
            >
              <option value="recent">Plus récent</option>
              <option value="oldest">Plus ancien</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <ChevronDown size={14} className="text-slate-400" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
