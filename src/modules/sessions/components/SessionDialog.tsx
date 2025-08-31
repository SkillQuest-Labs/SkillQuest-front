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
  formSession: SessionFormType;
  setFormSession: (form: SessionFormType) => void;
  onSave: () => void;
  isEditing: boolean;
  sessionSlots: { startDate: string; startTime: string; endTime: string }[];
}

export const SessionDialog = ({
  open,
  onOpenChange,
  formSession,
  setFormSession,
  onSave,
  isEditing,
  sessionSlots,
}: SessionDialogProps) => {
  const isFormValid =
    formSession.title.trim() &&
    formSession.startDate &&
    formSession.startTime &&
    formSession.endTime &&
    formSession.linkedQuest;

  const hasTimeConflict = Boolean(
    formSession.startTime &&
      formSession.endTime &&
      convertToMinutes(formSession.endTime) <= convertToMinutes(formSession.startTime),
  );

  const hasSessionConflict = Boolean(
    formSession.startTime &&
      formSession.endTime &&
      isTimeSlotConflict(formSession.startTime, formSession.endTime, sessionSlots),
  );

  const userId = "uuid-user-1234-5678-9012-345678901234";
  const { skills, loading: loadingSkills } = useGetSkills(userId);
  const { quests, loading: loadingQuests } = useGetQuests(formSession.linkedSkill);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la session" : "Nouvelle session"}</DialogTitle>
          <DialogDescription>{isEditing ? "Modifiez votre session" : "Ajoutez une nouvelle session"}</DialogDescription>
        </DialogHeader>

        <SessionForm
          currentSession={formSession}
          setForm={setFormSession}
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
