import { useGetQuests } from "@/shared/services/quest/api-quest";
import type { Quest } from "@/shared/types/quest.type";

type Props = {
  skillId: string;
  title?: string;
  limit?: number;
};

export const QuestHistory: React.FC<Props> = ({ skillId, title = "Historique des quêtes", limit }) => {
  const { quests = [], loading, error } = useGetQuests(skillId);

  if (!skillId) return null;
  if (loading) return <p className="text-slate-400">Chargement…</p>;
  if (error) return <p className="text-rose-400">Erreur lors du chargement</p>;
  if (!quests || quests.length === 0)
    return (
      <section className="mt-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-3">{title}</h3>
        <p className="text-slate-500">Aucune quête pour cette compétence.</p>
      </section>
    );

  // tri par date
  const sorted = [...quests].sort((a: Quest, b: Quest) => {
    const ta = new Date(a.completionTime || 0).getTime();
    const tb = new Date(b.completionTime || 0).getTime();
    return tb - ta;
  });

  const rows = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  const statusCls: Record<string, string> = {
    LOCKED: "bg-slate-600/30 text-slate-400 border-slate-500/40",
    UNLOCKED: "bg-blue-500/20 text-blue-300 border-blue-400/40",
    COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40",
  };

  const diffIcon: Record<string, string> = {
    EASY: "🌱",
    MEDIUM: "⚔️",
    HARD: "👑",
  };

  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-3">{title}</h3>

      {/* Grille responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((q) => (
          <article
            key={q.questId}
            className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white text-sm line-clamp-2">{q.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusCls[q.status]}`}>{q.status}</span>
            </div>

            {/* Infos principales */}
            <div className="text-[12px] text-slate-400 flex justify-between mb-2">
              <span>{q.difficulty ? `${diffIcon[q.difficulty]} ${q.difficulty}` : "—"}</span>
              <span>✨ {q.xp ?? 0} XP</span>
            </div>

            {/* Date */}
            <div className="text-[11px] text-slate-500">
              📅{" "}
              {q.completionTime
                ? new Date(q.completionTime).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
