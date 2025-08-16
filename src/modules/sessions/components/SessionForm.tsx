import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import type { SessionFormProps } from "../types/session-form.type";
import { SelectSkillField } from "./SelectSkillField";
import { SelectQuestField } from "./SelectQuestField";
import { ColorPicker } from "./ColorPicker";

export const SessionForm = ({ form, setForm, skills, quests, loadingSkills, loadingQuests }: SessionFormProps) => {
  return (
    <>
      <Input
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="mb-2"
      />

      <Textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="text-sm text-white mb-1 block">Date</label>
          <Input
            type="date"
            className="[color-scheme:dark]"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-white mb-1 block">Heure de début</label>
          <Input
            type="time"
            className="[color-scheme:dark]"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-white mb-1 block">Heure de fin</label>
          <Input
            type="time"
            className="[color-scheme:dark]"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            min={form.startTime || undefined}
          />
        </div>
      </div>

      <SelectSkillField form={form} setForm={setForm} skills={skills} loading={loadingSkills} />
      <SelectQuestField
        form={form}
        setForm={setForm}
        quests={quests}
        loading={loadingQuests}
        disabled={!form.linkedSkill}
      />
      <ColorPicker form={form} setForm={setForm} />
    </>
  );
};
