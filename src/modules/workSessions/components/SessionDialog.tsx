import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { useGetQuestsUser } from "@/shared/services/quest/api-quest";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    endTime: string;
    linkedQuest: string;
    color: string;
  };
  setForm: (form: SessionDialogProps["form"]) => void;
  onSave: () => void;
  isEditing: boolean;
}

export const SessionDialog = ({ open, onOpenChange, form, setForm, onSave, isEditing }: SessionDialogProps) => {
  const isFormValid = form.title.trim() && form.startDate && form.startTime && form.endTime && form.linkedQuest;

  const userId = "uuid-user-1234-5678-9012-345678901234";
  const { quests, loading } = useGetQuestsUser(userId);

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
            <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-white mb-1 block">Choisir une quête</label>
          <select
            value={form.linkedQuest || ""}
            onChange={(e) => setForm({ ...form, linkedQuest: e.target.value })}
            className="w-full p-2 rounded bg-slate-800 border border-slate-600 text-white"
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

        <div className="mb-4">
          <label className="text-sm text-white mb-1 block">Étiquette</label>
          <div className="flex space-x-2">
            {["#3B82F6", "#A78BFA", "#F472B6", "#34D399", "#F59E0B"].map((color) => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 ${form.color === color ? "border-white" : "border-transparent"}`}
                style={{ backgroundColor: color }}
                onClick={() => setForm({ ...form, color })}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            onClick={onSave}
            disabled={!isFormValid}
            className={`${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"} text-white`}
          >
            {isEditing ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
