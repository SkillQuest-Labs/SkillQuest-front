import type { SessionFormType } from "../types/session-form.type";

interface SelectQuestProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  quests: any[];
  loading: boolean;
  disabled?: boolean;
}

export const SelectQuestField = ({ currentSession, setForm, quests, loading, disabled = false }: SelectQuestProps) => {
  return (
    <div className="mb-4">
      <label className="text-sm text-white mb-1 block">Choisir une quête</label>
      <select
        value={currentSession.linkedQuest}
        onChange={(e) => setForm({ ...currentSession, linkedQuest: e.target.value })}
        disabled={disabled}
        className={`w-full p-2 rounded border ${
          disabled
            ? "bg-slate-700 border-slate-700 text-slate-400 cursor-not-allowed"
            : "bg-slate-800 border-slate-600 text-white"
        }`}
      >
        <option value="">Aucune</option>
        {loading ? (
          <option disabled>Chargement...</option>
        ) : (
          quests?.map((quest) => (
            <option key={quest.id} value={quest.id}>
              {quest.title}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
