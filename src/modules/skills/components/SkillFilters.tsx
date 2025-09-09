import type { SkillSort, FilterSkillDifficulty, FilterSkillStatus } from "../skills.types";
import { Search } from "lucide-react";

type SkillFiltersProps = {
  difficulty: FilterSkillDifficulty;
  sort: SkillSort;
  status: FilterSkillStatus;
  onFilterChange: (filters: { difficulty: FilterSkillDifficulty; sort: SkillSort; status: FilterSkillStatus }) => void;
};

export const SkillFilters = ({ difficulty, sort, status, onFilterChange }: SkillFiltersProps) => {
  return (
    <div className="mt-2 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Filtre par titre */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            placeholder="Filtrer par skill…"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-9 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Filtre par difficulté */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={difficulty}
            onChange={(e) => onFilterChange({ difficulty: e.target.value as FilterSkillDifficulty, sort, status })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"
          >
            <option value="All">Toutes les difficultés</option>
            <option value="EASY">Facile</option>
            <option value="MEDIUM">Moyen</option>
            <option value="HARD">Difficile</option>
          </select>
        </div>

        {/* Filtre par statut */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={status}
            onChange={(e) => onFilterChange({ difficulty, sort, status: e.target.value as FilterSkillStatus })}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="NOT_STARTED">Non commencé</option>
            <option value="COMPLETED">Terminé</option>
          </select>
        </div>
      </div>
    </div>
  );
};
