import type { SessionFormType } from "../types/session-form.type";

interface SelectSkillProps {
  form: SessionFormType;
  setForm: (form: SessionFormType) => void;
  skills: any[];
  loading: boolean;
}

export const SelectSkillField = ({ form, setForm, skills, loading }: SelectSkillProps) => {
  return (
    <div className="mb-4">
      <label className="text-sm text-white mb-1 block">Choisir un skill</label>
      <select
        value={form.linkedSkill}
        onChange={(e) =>
          setForm({
            ...form,
            linkedSkill: e.target.value,
            linkedQuest: "", // reset linked quest when skill changes
          })
        }
        className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white"
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
