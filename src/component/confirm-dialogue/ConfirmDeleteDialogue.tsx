import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  messageDialogue: string;
  deleteLoading?: boolean;
  handleConfirmDelete: () => Promise<void> | void;
};

export const ConfirmDeleteDialogue = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  messageDialogue,
  deleteLoading = false,
  handleConfirmDelete,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-red-400">Confirmer la suppression</DialogTitle>
          <DialogDescription className="text-slate-300">{messageDialogue}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
