import type { Quest } from "@/shared/types/quest.type";
import type { SessionFormType } from "../types/session-form.type";

interface SelectQuestProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  quests: Quest[];
  loading: boolean;
  disabled?: boolean;
}

export const SelectQuestField = ({ currentSession, setForm, quests, loading, disabled = false }: SelectQuestProps) => {
  return (
    <div className="mb-4 min-w-0">
      <label className="text-sm text-white mb-1 block">Choisir une quête</label>
      <select
        value={currentSession.linkedQuests?.[0]?.id ?? ""}
        onChange={(e) => {
          const selectedId = e.currentTarget.value;
          setForm({
            ...currentSession,
            linkedQuests: selectedId
              ? quests
                  .filter((quest) => quest.questId === selectedId)
                  .map((quest) => ({ id: quest.questId, title: quest.title }))
              : [],
          });
        }}
        disabled={disabled}
        className="
          block w-full h-10
          rounded-md bg-slate-800 text-white
          border border-slate-600
          px-3 pr-8
          overflow-hidden text-ellipsis whitespace-nowrap
          outline-none ring-2 ring-transparent
          focus:border-sky-400 focus:ring-sky-500/40
          disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed
        "
      >
        <option value="">Aucune</option>
        {loading ? (
          <option disabled>Chargement...</option>
        ) : (
          quests?.map((q) => (
            <option key={q.questId} value={q.questId}>
              {q.title}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
