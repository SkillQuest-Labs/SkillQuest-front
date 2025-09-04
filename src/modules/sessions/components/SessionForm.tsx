import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import type { SessionFormProps } from "../types/session-form.type";
import { SelectSkillField } from "./SelectSkillField";
import { SelectQuestField } from "./SelectQuestField";
import { ColorPicker } from "./ColorPicker";

export const SessionForm = ({
  currentSession,
  setForm,
  skills,
  quests,
  loadingSkills,
  loadingQuests,
}: SessionFormProps) => {
  return (
    <>
      <Input
        placeholder="Titre"
        value={currentSession.title}
        onChange={(e) => setForm({ ...currentSession, title: e.target.value })}
        className="mb-2"
      />

      <Textarea
        placeholder="Description"
        value={currentSession.description}
        onChange={(e) => setForm({ ...currentSession, description: e.target.value })}
        className="mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="text-sm text-white mb-1 block">Date</label>
          <Input
            type="date"
            className="[color-scheme:dark]"
            value={currentSession.startDate}
            onChange={(e) => setForm({ ...currentSession, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-white mb-1 block">Heure de début</label>
          <Input
            type="time"
            className="[color-scheme:dark]"
            value={currentSession.startTime}
            onChange={(e) => setForm({ ...currentSession, startTime: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm text-white mb-1 block">Heure de fin</label>
          <Input
            type="time"
            className="[color-scheme:dark]"
            value={currentSession.endTime}
            onChange={(e) => setForm({ ...currentSession, endTime: e.target.value })}
            min={currentSession.startTime || undefined}
          />
        </div>
      </div>

      <SelectSkillField currentSession={currentSession} setForm={setForm} skills={skills} loading={loadingSkills} />
      <SelectQuestField
        currentSession={currentSession}
        setForm={setForm}
        quests={quests}
        loading={loadingQuests}
        disabled={!currentSession.linkedSkill}
      />
      <ColorPicker currentSession={currentSession} setForm={setForm} />
    </>
  );
};
