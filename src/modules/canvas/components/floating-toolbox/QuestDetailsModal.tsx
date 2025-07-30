import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import type { QuestNodeData } from "../../canvas.type";
import { Button } from "@/shared/components/ui/button";

export type QuestDetailsModalProps = {
  open: boolean;
  quest: QuestNodeData | null;
  onClose: () => void;
};

export const QuestDetailsModal = ({ open, quest, onClose }: QuestDetailsModalProps) => {
  if (!open || !quest) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        style={{ maxWidth: "1000px" }}
        className="w-[900px] max-h-[95vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl rounded-xl"
      >
        <DialogHeader className="text-left border-b border-slate-700/50">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Titre de la quete</label>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center leading-tight">
              {quest.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Description</label>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 max-h-[400px] overflow-y-auto scrollbar-hide">
              <p className="text-lg text-slate-200 leading-relaxed whitespace-pre-wrap font-light">
                {quest.description}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-600">
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            className="w-full sm:w-auto bg-gradient-to-br from-red-700 via-red-900 to-gray-800 h-12 cursor-pointer px-6 border-gray-600 text-gray-300 hover:bg-red-800 hover:text-gray-100"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
