import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/routes/router.const";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import "@/styles/sessions-listing.css";
import { SessionCard } from "./components/SessionCard";
import { EmptySessions } from "./components/EmptySession";
import { useListSessions } from "@/shared/services/session/api-session";
import { SessionFilter } from "./components/SessionFilter";
import { Pagination } from "./components/SessionPagination";
import type { SessionFilterValue } from "./types/session-form.type";

const SESSION_FILTER_INIT: SessionFilterValue = {
  skillTitle: "",
  questTitle: "",
  date: "",
  includeValidated: false,
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
    skill: filters.skillTitle,
    quest: filters.questTitle,
    date: filters.date,
    limit: pageSize,
    page: currentPage,
    includeValidated: filters.includeValidated,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.skillTitle, filters.questTitle, filters.date, filters.includeValidated]);

  const handleFilterChange = (next: SessionFilterValue) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(SESSION_FILTER_INIT);
    setCurrentPage(1);
  };

  const handleToggleValidated = (include: boolean) => {
    setFilters({ ...filters, includeValidated: include });
    setCurrentPage(1);
  };

  const computedTotalPages = totalPages || Math.max(1, Math.ceil((total || 0) / (effectivePageSize || pageSize)));

  return (
    <div className="p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)] w-full has-fixed-pager">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-3">
          <Button
            onClick={() => navigate(routes.workSession.path)}
            aria-label="Retour au calendrier"
            className="h-9 w-9 p-0 rounded-full bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 cursor-pointer"
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

      <SessionFilter
        value={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        resultsCount={total}
        includeValidated={filters.includeValidated}
        onToggleValidated={handleToggleValidated}
      />

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
                className="session-card h-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 transition-all cursor-pointer"
              >
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        )}

        {total > (effectivePageSize || pageSize) && (
          <div className="pager-fixed">
            <Pagination currentPage={currentPage} totalPages={computedTotalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>
    </div>
  );
};
