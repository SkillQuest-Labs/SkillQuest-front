import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import "@/styles/sessions-listing.css";
import { SessionCard } from "./components/SessionCard";
import { EmptySessions } from "./components/EmptySession";
import { useListSessions } from "@/shared/services/session/api-session";
import { SessionFilter, type SessionFilterValue } from "./components/SessionFilter";
import { Pagination } from "./components/SessionPagination";

const SESSION_FILTER_INIT: SessionFilterValue = {
  skill: "",
  quest: "",
  date: "",
};

export const SessionsListing = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<SessionFilterValue>(SESSION_FILTER_INIT);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const {
    sessions,
    total,
    pageCount: totalPages,
    loading,
    limit: effectivePageSize,
  } = useListSessions({
    skill: filters.skill,
    quest: filters.quest,
    date: filters.date,
    limit: pageSize,
    page: currentPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.skill, filters.quest, filters.date]);

  const handleFilterChange = (next: SessionFilterValue) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(SESSION_FILTER_INIT);
    setCurrentPage(1);
  };

  const computedTotalPages = totalPages || Math.max(1, Math.ceil((total || 0) / (effectivePageSize || pageSize)));

  return (
    <div className="p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)] w-full has-fixed-pager">
      {/* Header */}
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

      <SessionFilter value={filters} onChange={handleFilterChange} onReset={handleResetFilters} resultsCount={total} />

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

        {/* Pagination : s'affiche seulement si le total dépasse la taille de page */}
        {total > (effectivePageSize || pageSize) && (
          <div className="pager-fixed">
            <Pagination currentPage={currentPage} totalPages={computedTotalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  );
};
