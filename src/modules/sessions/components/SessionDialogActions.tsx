import { Button } from "@/shared/components/ui/button";

type SessionDialogActionsProps = {
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  isEditing: boolean;
  editingSessionId?: string | null;
  isDeleting?: boolean;
  saveDisabled: boolean;
};

export const SessionDialogActions = ({
  onClose,
  onSave,
  onDelete,
  isEditing,
  editingSessionId,
  isDeleting = false,
  saveDisabled,
}: SessionDialogActionsProps) => {
  return (
    <div className="flex items-center mt-4 justify-end">
      {isEditing && !!editingSessionId && (
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
          className="mr-auto bg-red-600 hover:bg-red-700 text-white"
        >
          {isDeleting ? "Suppression..." : "Supprimer"}
        </Button>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button
          onClick={onSave}
          disabled={saveDisabled}
          className={`${!saveDisabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"} text-white`}
        >
          {isEditing ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
};
