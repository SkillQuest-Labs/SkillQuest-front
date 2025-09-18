import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { useGetQuests } from "@/shared/services/quest/api-quest";
import { useGetSkills } from "@/shared/services/skill/api-skill";
import type { SessionFormType } from "../types/session-form.type";
import { SessionForm } from "./SessionForm";
import { convertToMinutes, isTimeSlotConflict } from "../utils/session.utils";
import { CircleAlert } from "lucide-react";
import { SessionDialogActions } from "./SessionDialogActions";
import { useUser } from "@clerk/clerk-react";

interface SessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formSession: SessionFormType;
  setFormSession: (form: SessionFormType) => void;
  onSave: () => void;
  isEditing: boolean;
  sessionSlots: { startDate: string; startTime: string; endTime: string }[];
  editingSessionId?: string | null;
  setIsDeleteDialogOpen: (open: boolean) => void;
  isDeleting?: boolean;
}

export const SessionDialog = ({
  open,
  onOpenChange,
  formSession,
  setFormSession,
  onSave,
  isEditing,
  sessionSlots,
  editingSessionId,
  setIsDeleteDialogOpen,
  isDeleting = false,
}: SessionDialogProps) => {
  const isFormValid =
    formSession.startDate &&
    formSession.startTime &&
    formSession.endTime &&
    formSession.linkedSkill &&
    (formSession.linkedQuests?.length ?? 0) > 0;

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

  const { user } = useUser();
  const userId = user?.id;
  const { skills, loading: loadingSkills } = useGetSkills(userId || "");
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

        <SessionDialogActions
          onClose={() => onOpenChange(false)}
          onSave={onSave}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          isEditing={isEditing}
          editingSessionId={editingSessionId}
          isDeleting={isDeleting}
          saveDisabled={!isFormValid || hasTimeConflict || hasSessionConflict}
        />
      </DialogContent>
    </Dialog>
  );
};
