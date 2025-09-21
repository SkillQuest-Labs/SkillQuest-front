import type { Skill } from "@/shared/types/skill.type";
import type { SessionFormType } from "../types/session-form.type";

interface SelectSkillProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  skills: Skill[];
  loading: boolean;
  disabled?: boolean;
}

export const SelectSkillField = ({ currentSession, setForm, skills, loading, disabled = false }: SelectSkillProps) => {
  const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSkill = skills.find((skill) => skill.id === e.target.value);
    setForm({
      ...currentSession,
      linkedSkill: e.target.value,
      title: selectedSkill?.title || "",
      linkedQuests: [],
    });
  };

  return (
    <div className="mb-4 min-w-0">
      <label className="text-sm text-white mb-1 block">Choisir un skill</label>
      <select
        value={currentSession.linkedSkill}
        onChange={handleSkillChange}
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
        disabled={loading || disabled}
      >
        <option value="">Aucune</option>
        {loading ? (
          <option disabled>Chargement...</option>
        ) : (
          skills?.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.title}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
