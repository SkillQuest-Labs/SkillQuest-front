import { useMemo } from "react";
import { useGetSessions } from "@/shared/services/session/api-session";
import { useUser } from "@clerk/clerk-react";
import "@/styles/sessions-listing.css";
import { SessionCard } from "./components/SessionCard";
import { EmptySessions } from "./components/EmptySession";

export const SessionsListing = () => {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const { sessions } = useGetSessions(userId);

  const items = useMemo(() => sessions ?? [], [sessions]);

  return (
    <div className="p-4 md:p-8 flex flex-col min-h-[calc(100vh-4rem)] w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-100 tracking-tight">Toutes vos sessions</h1>
      </div>

      <div className="mt-8">
        {!sessions ? (
          <div className="text-slate-400">Chargement des sessions…</div>
        ) : items.length === 0 ? (
          <EmptySessions />
        ) : (
          // ➜ grille claire et aérée
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((session) => (
              <div
                key={session.id}
                className="session-card h-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 transition-all"
              >
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
