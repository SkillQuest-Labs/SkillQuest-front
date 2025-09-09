import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import { ArrowLeft, Search, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import "@/styles/sessions-listing.css";
import { SessionCard } from "./components/SessionCard";
import { EmptySessions } from "./components/EmptySession";
import { useListSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";

const SESSION_FILTER_INIT = {
  skill: "",
  quest: "",
  date: "",
};
export const SessionsListing = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id ?? "";

  const [sessionFilter, setSessionFilter] = useState(SESSION_FILTER_INIT);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { sessions, loading } = useListSessions({
    skill: sessionFilter.skill,
    quest: sessionFilter.quest,
    date: sessionFilter.date,
    limit,
    page,
    userId,
  });

  const hasActiveFilters = !!(sessionFilter.quest || sessionFilter.quest || sessionFilter.date);

  const resetFilters = () => {
    setSessionFilter(SESSION_FILTER_INIT);
    setPage(1);
  };

  return (
    <div className="p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)] w-full">
      {/* Header: flèche + titre + sous-titre */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-3">
          <Button
            onClick={() => navigate(routes.workSession.path)}
            aria-label="Retour au calendrier"
            className="h-9 w-9 p-0 rounded-full bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 tracking-tight">Toutes vos sessions</h1>
            <p className="mt-1 text-sm md:text-base text-slate-400">
              Consultez, lancez, validez ou supprimez vos sessions planifiées.
            </p>
          </div>
        </div>
      </div>

      {/* Barre de filtres (inputs contrôlés, pas de filtrage local) */}
      <div className="mt-2 rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Filtre Skill */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={sessionFilter.skill}
              onChange={(e) => {
                setSessionFilter({ ...sessionFilter, skill: e.target.value });
                setPage(1);
              }}
              placeholder="Filtrer par skill…"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-9 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {sessionFilter.skill && (
              <button
                aria-label="Effacer le filtre skill"
                onClick={() => {
                  setSessionFilter({ ...sessionFilter, skill: "" });
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtre Quête */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={sessionFilter.quest}
              onChange={(e) => {
                setSessionFilter({ ...sessionFilter, quest: e.target.value });
                setPage(1);
              }}
              placeholder="Filtrer par quête…"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-9 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {sessionFilter.quest && (
              <button
                aria-label="Effacer le filtre quête"
                onClick={() => {
                  setSessionFilter({ ...sessionFilter, quest: "" });
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtre Date */}
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={sessionFilter.date}
              onChange={(e) => {
                setSessionFilter({ ...sessionFilter, date: e.target.value });
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 pl-10 pr-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            {sessionFilter.date && (
              <button
                aria-label="Effacer le filtre date"
                onClick={() => {
                  setSessionFilter({ ...sessionFilter, date: "" });
                  setPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Actions/infos filtres */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            {sessions.length} résultat{sessions.length > 1 ? "s" : ""} affiché{sessions.length > 1 ? "s" : ""}.
          </div>

          {hasActiveFilters && (
            <Button
              onClick={resetFilters}
              className="self-start sm:self-auto rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700"
            >
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-slate-400">Chargement des sessions…</div>
        ) : !sessions.length ? (
          <EmptySessions />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="session-card h-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 transition-all"
              >
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        )}

        {!!sessions.length && (
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700"
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg bg-slate-800/70 text-slate-200 hover:bg-slate-700"
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
