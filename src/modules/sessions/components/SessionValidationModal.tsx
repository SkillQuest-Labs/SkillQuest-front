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
  onValidateSession: (validatedQuests: string[]) => void;
  validationLoading?: boolean;
  isSessionValidated?: boolean;
};

export const SessionValidationModal = ({
  isOpen,
  setIsOpen,
  session,
  onValidateSession,
  validationLoading = false,
  isSessionValidated = false,
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
          <DialogTitle className="text-white text-2xl font-semibold">
            {isSessionValidated ? `Compléter ${session.linkedSkill.title}` : session.linkedSkill.title}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {isSessionValidated
              ? "Cette session est déjà validée. Sélectionnez les quêtes supplémentaires que vous avez accomplies."
              : "Sélectionnez les quêtes que vous avez accomplies lors de cette session"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {session.quests.length > 0 ? (
            <div className="space-y-3">
              {isSessionValidated ? (
                <div className="space-y-2">
                  {(() => {
                    const completedQuests = session.quests.filter(
                      (sessionQuest) => sessionQuest.quest?.status === "COMPLETED",
                    );
                    const unvalidatedQuests = session.quests.filter(
                      (sessionQuest) => sessionQuest.quest?.status !== "COMPLETED",
                    );

                    return (
                      <>
                        {completedQuests.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-green-300 bg-green-900/20 px-3 py-2 rounded-lg">
                              Quêtes validées ({completedQuests.length})
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {completedQuests.map((sessionQuest) => (
                                <div
                                  key={`validated-${sessionQuest.id}`}
                                  className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-800/50 border-slate-600/50"
                                >
                                  <Checkbox
                                    id={`validated-${sessionQuest.id}`}
                                    checked={true}
                                    disabled={true}
                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                  />
                                  <label
                                    htmlFor={`validated-${sessionQuest.id}`}
                                    className="flex-1 text-sm text-green-300 line-through cursor-not-allowed"
                                  >
                                    {sessionQuest.quest?.title || sessionQuest.title}
                                  </label>
                                  <Check className="h-4 w-4 text-green-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {unvalidatedQuests.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-300 bg-slate-700/50 px-3 py-2 rounded-lg">
                              Quêtes à valider ({unvalidatedQuests.length})
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {unvalidatedQuests.map((sessionQuest) => {
                                const isQuestSelected = validatedQuests.includes(sessionQuest.id);
                                return (
                                  <div
                                    key={`unvalidated-${sessionQuest.id}`}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                      isQuestSelected
                                        ? "bg-green-900/20 border-green-600/50"
                                        : "bg-slate-700/30 border-slate-600/50"
                                    }`}
                                  >
                                    <Checkbox
                                      id={`unvalidated-${sessionQuest.id}`}
                                      checked={isQuestSelected}
                                      onCheckedChange={() => handleQuestToggle(sessionQuest.id)}
                                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                    />
                                    <label
                                      htmlFor={`unvalidated-${sessionQuest.id}`}
                                      className={`flex-1 text-sm cursor-pointer transition-colors ${
                                        isQuestSelected ? "text-green-100" : "text-slate-200"
                                      }`}
                                    >
                                      {sessionQuest.quest?.title || sessionQuest.title}
                                    </label>
                                    {isQuestSelected && <Check className="h-4 w-4 text-green-400" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {completedQuests.length > 0 && unvalidatedQuests.length === 0 && (
                          <div className="text-center py-4 text-slate-400 bg-slate-800/30 rounded-lg">
                            <p className="text-sm">Cette session est complètement validée</p>
                            <p className="text-xs mt-1">Toutes les quêtes ont été accomplies</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-2">
                  {(() => {
                    const completedQuests = session.quests.filter(
                      (sessionQuest) => sessionQuest.quest?.status === "COMPLETED",
                    );
                    const unvalidatedQuests = session.quests.filter(
                      (sessionQuest) => sessionQuest.quest?.status !== "COMPLETED",
                    );

                    return (
                      <>
                        {completedQuests.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-green-300 bg-green-900/20 px-3 py-2 rounded-lg">
                              Quêtes validées ({completedQuests.length})
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {completedQuests.map((sessionQuest) => (
                                <div
                                  key={`validated-${sessionQuest.id}`}
                                  className="flex items-center space-x-3 p-3 rounded-lg border bg-slate-800/50 border-slate-600/50"
                                >
                                  <Checkbox
                                    id={`validated-${sessionQuest.id}`}
                                    checked={true}
                                    disabled={true}
                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                  />
                                  <label
                                    htmlFor={`validated-${sessionQuest.id}`}
                                    className="flex-1 text-sm text-green-300 line-through cursor-not-allowed"
                                  >
                                    {sessionQuest.quest?.title || sessionQuest.title}
                                  </label>
                                  <Check className="h-4 w-4 text-green-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {unvalidatedQuests.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-slate-300 bg-slate-700/50 px-3 py-2 rounded-lg">
                              Quêtes à valider ({unvalidatedQuests.length})
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {unvalidatedQuests.map((sessionQuest) => {
                                const isQuestSelected = validatedQuests.includes(sessionQuest.id);
                                return (
                                  <div
                                    key={`unvalidated-${sessionQuest.id}`}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                      isQuestSelected
                                        ? "bg-green-900/20 border-green-600/50"
                                        : "bg-slate-700/30 border-slate-600/50"
                                    }`}
                                  >
                                    <Checkbox
                                      id={`unvalidated-${sessionQuest.id}`}
                                      checked={isQuestSelected}
                                      onCheckedChange={() => handleQuestToggle(sessionQuest.id)}
                                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                    />
                                    <label
                                      htmlFor={`unvalidated-${sessionQuest.id}`}
                                      className={`flex-1 text-sm cursor-pointer transition-colors ${
                                        isQuestSelected ? "text-green-100" : "text-slate-200"
                                      }`}
                                    >
                                      {sessionQuest.quest?.title || sessionQuest.title}
                                    </label>
                                    {isQuestSelected && <Check className="h-4 w-4 text-green-400" />}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <X className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Aucune quête associée à cette session</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {isSessionValidated ? (
            (() => {
              const unvalidatedQuests = session.quests.filter(
                (sessionQuest) => sessionQuest.quest?.status !== "COMPLETED",
              );
              return unvalidatedQuests.length === 0 ? (
                <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700 text-white">
                  Fermer
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleValidateSession}
                    disabled={validationLoading || validatedQuests.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    {validationLoading ? (
                      "Validation..."
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Compléter la session
                      </>
                    )}
                  </Button>
                </>
              );
            })()
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-slate-700/50"
              >
                Annuler
              </Button>
              <Button
                onClick={handleValidateSession}
                disabled={validationLoading || validatedQuests.length === 0}
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
