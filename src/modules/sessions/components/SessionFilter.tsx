import { Search, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { SessionFilterValue } from "../types/session-form.type";

type SessionFilterProps = {
  value: SessionFilterValue;
  onChange: (next: SessionFilterValue) => void;
  onReset: () => void;
  resultsCount: number;
  includeValidated: boolean;
  onToggleValidated: (include: boolean) => void;
};

export const SessionFilter = ({
  value,
  onChange,
  onReset,
  resultsCount,
  includeValidated,
  onToggleValidated,
}: SessionFilterProps) => {
  const hasActiveFilters = !!(value.skillTitle || value.questTitle || value.date || includeValidated);

  return (
    <div className="mt-2 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={value.skillTitle}
            onChange={(e) => onChange({ ...value, skillTitle: e.target.value })}
            placeholder="Filtrer par skill…"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-9 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-text"
          />
          {value.skillTitle && (
            <button
              aria-label="Effacer le filtre skill"
              onClick={() => onChange({ ...value, skillTitle: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filtre Quête */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={value.questTitle}
            onChange={(e) => onChange({ ...value, questTitle: e.target.value })}
            placeholder="Filtrer par quête…"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-9 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-text"
          />
          {value.questTitle && (
            <button
              aria-label="Effacer le filtre quête"
              onClick={() => onChange({ ...value, questTitle: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={value.date}
            onChange={(e) => onChange({ ...value, date: e.target.value })}
            className="date-input w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
          />
          {value.date && (
            <button
              aria-label="Effacer le filtre date"
              onClick={() => onChange({ ...value, date: "" })}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Toggle pour inclure les sessions validées */}
      <div className="mt-4 flex items-center gap-4 p-4">
        <button
          type="button"
          onClick={() => onToggleValidated(!includeValidated)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer ${
            includeValidated ? "bg-blue-600" : "bg-slate-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              includeValidated ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>

        <div>
          <div className="text-sm font-medium text-slate-200">Inclure les sessions validées</div>
          <div className="text-xs text-slate-400">Afficher également les sessions validées</div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">
          {resultsCount} résultat{resultsCount > 1 ? "s" : ""} au total.
        </div>

        {hasActiveFilters && (
          <Button
            onClick={onReset}
            className="self-start sm:self-auto rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700 cursor-pointer"
          >
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  );
};
