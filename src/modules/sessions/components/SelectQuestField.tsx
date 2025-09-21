import type { Quest } from "@/shared/types/quest.type";
import type { SessionFormType } from "../types/session-form.type";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface SelectQuestProps {
  currentSession: SessionFormType;
  setForm: (form: SessionFormType) => void;
  quests: Quest[];
  loading: boolean;
  disabled?: boolean;
}

export const SelectQuestField = ({ currentSession, setForm, quests, loading, disabled = false }: SelectQuestProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const questCount = currentSession.linkedQuests.length;
  const questText =
    questCount === 0
      ? "Aucune quête sélectionnée"
      : `${questCount} quête${questCount > 1 ? "s" : ""} sélectionnée${questCount > 1 ? "s" : ""}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleQuestToggle = (questId: string, questTitle: string) => {
    const isSelected = currentSession.linkedQuests.some((quest) => quest.id === questId);

    if (isSelected) {
      setForm({
        ...currentSession,
        linkedQuests: currentSession.linkedQuests.filter((quest) => quest.id !== questId),
      });
      return;
    }

    setForm({
      ...currentSession,
      linkedQuests: [...currentSession.linkedQuests, { id: questId, title: questTitle }],
    });
  };

  const handleSelectAll = () => {
    const allQuestsSelected = currentSession.linkedQuests.length === quests.length;
    setForm({
      ...currentSession,
      linkedQuests: allQuestsSelected ? [] : quests.map((quest) => ({ id: quest.questId, title: quest.title })),
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const questCount = currentSession.linkedQuests.length;
  const questText =
    questCount === 0
      ? "Aucune quête sélectionnée"
      : `${questCount} quête${questCount > 1 ? "s" : ""} sélectionnée${questCount > 1 ? "s" : ""}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleQuestToggle = (questId: string, questTitle: string) => {
    const isSelected = currentSession.linkedQuests.some((quest) => quest.id === questId);

    if (isSelected) {
      setForm({
        ...currentSession,
        linkedQuests: currentSession.linkedQuests.filter((quest) => quest.id !== questId),
      });
      return;
    }

    setForm({
      ...currentSession,
      linkedQuests: [...currentSession.linkedQuests, { id: questId, title: questTitle }],
    });
  };

  const handleSelectAll = () => {
    const allQuestsSelected = currentSession.linkedQuests.length === quests.length;
    setForm({
      ...currentSession,
      linkedQuests: allQuestsSelected ? [] : quests.map((quest) => ({ id: quest.questId, title: quest.title })),
    });
  };

  return (
    <div className="mb-4 min-w-0">
      <label className="text-sm text-white mb-1 block">Choisir des quêtes</label>
      <div className="relative" ref={containerRef}>
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="
            w-full justify-between px-3 py-2 h-auto text-left
            bg-slate-800 border border-slate-600 rounded-md
            hover:bg-slate-700 hover:border-slate-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-slate-700 disabled:text-slate-400
          "
        >
          {questText}
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </Button>

        {isOpen && (
          <div
            className="
            absolute z-10 w-full mt-1
            bg-slate-800 border border-slate-600 rounded-md
            shadow-lg max-h-60 overflow-y-auto
          "
          >
            <div className="p-2 border-b border-slate-600">
              <Button
                type="button"
                onClick={handleSelectAll}
                variant="ghost"
                disabled={disabled}
                className={`
                  w-full justify-start px-2 py-1 h-auto text-sm font-medium
                  ${
                    disabled ? "text-gray-500 cursor-not-allowed" : "hover:bg-slate-700 hover:text-sky-200 text-sky-400"
                  }
                `}
              >
                {questCount === quests.length ? "Tout désélectionner" : "Tout sélectionner"}
              </Button>
            </div>

            {loading ? (
              <div className="p-3 text-center text-slate-400">Chargement...</div>
            ) : (
              quests?.map((quest) => {
                const isSelected = currentSession.linkedQuests.some(
                  (selectedQuest) => selectedQuest.id === quest.questId,
                );
                return (
                  <label
                    key={quest.questId}
                    className="
                      flex items-center px-3 py-2 cursor-pointer
                      hover:bg-slate-700
                    "
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleQuestToggle(quest.questId, quest.title)}
                      disabled={disabled}
                      className="mr-3 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <span className="text-sm text-white truncate">{quest.title}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {questCount > 0 && (
        <div className="mt-2">
          <div className="text-xs text-slate-400 mb-1">Quêtes sélectionnées :</div>
          <div className="flex flex-wrap gap-1">
            {currentSession.linkedQuests.map((quest) => (
              <span
                key={quest.id}
                className="
                  inline-flex items-center gap-1 px-2 py-1
                  bg-blue-500/20 text-blue-300 text-xs rounded
                  border border-blue-400/40
                "
              >
                {quest.title}
                <Button
                  type="button"
                  onClick={() => !disabled && handleQuestToggle(quest.id, quest.title)}
                  disabled={disabled}
                  className="
                    h-4 w-4 p-0 ml-1
                    bg-transparent
                    hover:bg-red-500/20
                    text-red-400 hover:text-red-300
                  "
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
