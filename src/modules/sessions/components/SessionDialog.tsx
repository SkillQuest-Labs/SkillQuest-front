import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useGetQuests } from "@/shared/services/quest/api-quest";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import type { SessionFormType } from "../types/session-form.type";
import { SessionForm } from "./SessionForm";
import { convertToMinutes, isTimeSlotConflict } from "../utils/session.utils";
import { CircleAlert } from "lucide-react";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: SessionFormType;
  setForm: (form: SessionFormType) => void;
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

  const hasTimeConflict = Boolean(
    form.startTime && form.endTime && convertToMinutes(form.endTime) <= convertToMinutes(form.startTime),
  );

  const hasSessionConflict = Boolean(
    form.startTime && form.endTime && isTimeSlotConflict(form.startTime, form.endTime, sessions),
  );

  const userId = "uuid-user-1234-5678-9012-345678901234";
  const { skills, loading: loadingSkills } = useGetSkills(userId);
  const { quests, loading: loadingQuests } = useGetQuests(form.linkedSkill);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
          <DialogDescription>{isEditing ? "Modifiez votre session" : "Ajoutez une nouvelle session"}</DialogDescription>
        </DialogHeader>

        <SessionForm
          form={form}
          setForm={setForm}
          skills={skills}
          quests={quests ?? []}
          loadingSkills={loadingSkills}
          loadingQuests={loadingQuests}
        />

        {hasTimeConflict && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <CircleAlert className="w-4 h-4" /> L’heure de fin doit être après l’heure de début.
          </p>
        )}

        {hasSessionConflict && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <CircleAlert className="w-4 h-4" /> Ce créneau chevauche une autre session.
          </p>
        )}

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
