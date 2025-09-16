import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { Session } from "@/shared/services/session/api-session.type";
import { Check, X } from "lucide-react";
import { useState } from "react";

type SessionValidationModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  session: Session;
  onValidateSession: (validatedQuests: string[]) => Promise<void>;
  validationLoading?: boolean;
};

export const SessionValidationModal = ({
  isOpen,
  setIsOpen,
  session,
  onValidateSession,
  validationLoading = false,
}: SessionValidationModalProps) => {
  const [validatedQuests, setValidatedQuests] = useState<string[]>([]);

  const handleQuestToggle = (questId: string) => {
    setValidatedQuests((prev) => (prev.includes(questId) ? prev.filter((id) => id !== questId) : [...prev, questId]));
  };

  const handleValidateSession = () => {
    onValidateSession(validatedQuests);
    setValidatedQuests([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setValidatedQuests([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-semibold">{session.linkedSkill.title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            Sélectionnez les quêtes que vous avez accomplies lors de cette session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {session.quests.length > 0 ? (
            <div className="space-y-3">
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {session.quests.map((quest) => {
                  const isQuestValidated = validatedQuests.includes(quest.id);
                  return (
                    <div
                      key={quest.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        isQuestValidated ? "bg-green-900/20 border-green-600/50" : "bg-slate-700/30 border-slate-600/50"
                      }`}
                    >
                      <Checkbox
                        id={quest.id}
                        checked={isQuestValidated}
                        onCheckedChange={() => handleQuestToggle(quest.id)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor={quest.id}
                        className={`flex-1 text-sm cursor-pointer transition-colors ${
                          isQuestValidated ? "text-green-100" : "text-slate-200"
                        }`}
                      >
                        {quest.quest?.title || quest.title}
                      </label>
                      {isQuestValidated && <Check className="h-4 w-4 text-green-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <X className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucune quête associée à cette session</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50"
          >
            Annuler
          </Button>
          <Button
            onClick={handleValidateSession}
            disabled={validationLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {validationLoading ? (
              "Validation..."
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Valider la session
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
