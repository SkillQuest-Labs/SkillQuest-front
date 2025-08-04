import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useGetQuests } from "@/shared/services/quest/api-quest";
import { useGetSkills } from "@/shared/services/skill/api-skill";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    endTime: string;
    linkedSkill: string;
    linkedQuest: string;
    color: string;
  };
  setForm: (form: SessionDialogProps["form"]) => void;
  onSave: () => void;
  isEditing: boolean;
  sessions: { startDate: string; startTime: string; endTime: string }[];
}

export const SessionDialog = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSave,
  isEditing,
  sessions,
}: SessionDialogProps) => {
  const isFormValid = form.title.trim() && form.startDate && form.startTime && form.endTime && form.linkedQuest;

  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeSlotConflict = (start: string, end: string, otherSessions: { startTime: string; endTime: string }[]) => {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    return otherSessions.some((s) => {
      const sMin = toMinutes(s.startTime);
      const eMin = toMinutes(s.endTime);
      return startMin < eMin && endMin > sMin;
    });
  };

  const hasTimeConflict = Boolean(
    form.startTime && form.endTime && toMinutes(form.endTime) <= toMinutes(form.startTime),
  );

  const hasSessionConflict = Boolean(
    form.startTime && form.endTime && isTimeSlotConflict(form.startTime, form.endTime, sessions),
  );

  const userId = "uuid-user-1234-5678-9012-345678901234";

  const { skills, loading: loadingSkills } = useGetSkills(userId);
  const { quests, loading: loadingQuestsSkill } = useGetQuests(form.linkedSkill);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
          <DialogDescription>{isEditing ? "Modifiez votre session" : "Ajoutez une nouvelle session"}</DialogDescription>
        </DialogHeader>

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
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-white mb-1 block">Heure de début</label>
            <Input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-white mb-1 block">Heure de fin</label>
            <Input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              min={form.startTime || undefined}
              disabled={!form.startTime}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-white mb-1 block">Choisir un skill</label>
          <select
            value={form.linkedSkill || ""}
            onChange={(e) => {
              const selectedSkill = e.target.value;
              setForm({
                ...form,
                linkedSkill: selectedSkill,
                linkedQuest: "",
              });
            }}
            className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white"
          >
            <option value="">Aucune</option>
            {loadingSkills ? (
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

        <div className="mb-4">
          <label className="text-sm text-white mb-1 block">Choisir une quête</label>
          <select
            value={form.linkedQuest || ""}
            onChange={(e) => setForm({ ...form, linkedQuest: e.target.value })}
            className={`w-full p-2 rounded border ${
              !form.linkedSkill
                ? "bg-slate-700 border-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-slate-800 border-slate-600 text-white"
            }`}
            disabled={!form.linkedSkill}
          >
            <option value="">Aucune</option>
            {loadingQuestsSkill ? (
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

        <div className="mb-4">
          <label className="text-sm text-white mb-1 block">Étiquette</label>
          <div className="flex space-x-2">
            {["#3B82F6", "#A78BFA", "#F472B6", "#34D399", "#F59E0B"].map((color) => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 ${
                  form.color === color ? "border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setForm({ ...form, color })}
              />
            ))}
          </div>
        </div>

        {hasTimeConflict && (
          <p className="text-red-500 text-sm mt-2">⚠️ L’heure de fin doit être après l’heure de début.</p>
        )}

        {hasSessionConflict && <p className="text-red-500 text-sm mt-2">⚠️ Ce créneau chevauche une autre session.</p>}

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={onSave}
            disabled={!isFormValid || hasTimeConflict || hasSessionConflict}
            className={`${
              isFormValid && !hasTimeConflict && !hasSessionConflict
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            } text-white`}
          >
            {isEditing ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
