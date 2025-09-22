import React, { useState } from "react";
import type { Quest } from "../types/dojo.types";
import { ChevronLeft, ChevronRight, BookOpen, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

interface SessionQuestDisplayProps {
  quests: Quest[];
  onQuestToggle?: (questId: string, isCompleted: boolean) => void;
}

export const SessionQuestDisplay: React.FC<SessionQuestDisplayProps> = ({ quests, onQuestToggle }) => {
  const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (quests.length === 0) {
    return null;
  }

  const currentQuest = quests[currentQuestIndex];
  const hasMultipleQuests = quests.length > 1;

  const goToNext = () => {
    setCurrentQuestIndex((prev) => (prev + 1) % quests.length);
    setIsDescriptionExpanded(false);
  };

  const goToPrevious = () => {
    setCurrentQuestIndex((prev) => (prev - 1 + quests.length) % quests.length);
    setIsDescriptionExpanded(false);
  };

  const goToQuest = (index: number) => {
    setCurrentQuestIndex(index);
    setIsDescriptionExpanded(false);
  };

  const handleQuestToggle = (questId: string) => {
    const isCurrentlyCompleted = completedQuests.has(questId);
    const newCompletedQuests = new Set(completedQuests);

    if (isCurrentlyCompleted) {
      newCompletedQuests.delete(questId);
    } else {
      newCompletedQuests.add(questId);
    }

    setCompletedQuests(newCompletedQuests);
    onQuestToggle?.(questId, !isCurrentlyCompleted);
  };

  const isQuestCompleted = (questId: string) => {
    return completedQuests.has(questId) || quests.find((q) => q.id === questId)?.isCompleted;
  };

  const totalCount = quests.length;
  const completedCount = quests.filter((quest) => isQuestCompleted(quest.id)).length;

  // Gestion des descriptions longues
  const MAX_DESCRIPTION_LENGTH = 100;
  const isDescriptionLong = currentQuest.description && currentQuest.description.length > MAX_DESCRIPTION_LENGTH;
  const shouldTruncate = isDescriptionLong && !isDescriptionExpanded;
  const displayDescription = shouldTruncate
    ? currentQuest.description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
    : currentQuest.description;

  return (
    <div className="relative">
      {/* Carte de la quête actuelle */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/30 rounded-lg p-3 relative">
        {isCollapsed ? (
          /* Mode collapsible - une ligne compacte */
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <BookOpen className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs">
                {completedCount}/{totalCount}
              </span>
              <h4 className="text-white font-medium text-sm truncate">{currentQuest.title}</h4>
              <button
                onClick={() => handleQuestToggle(currentQuest.id)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                title={isQuestCompleted(currentQuest.id) ? "Marquer comme non terminée" : "Marquer comme terminée"}
              >
                {isQuestCompleted(currentQuest.id) ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-white/40 rounded-full hover:border-white/60 transition-colors" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-4 h-4 text-white/70 hover:text-white transition-colors z-10 relative"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Mode étendu */
          <>
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs">
                {completedCount}/{totalCount}
              </span>
              <button
                onClick={() => setIsCollapsed(true)}
                className="w-4 h-4 text-white/70 hover:text-white transition-colors ml-auto"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 mb-1 pr-8">
              <h4 className="text-white font-medium text-sm">{currentQuest.title}</h4>
              <button
                onClick={() => handleQuestToggle(currentQuest.id)}
                className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                title={isQuestCompleted(currentQuest.id) ? "Marquer comme non terminée" : "Marquer comme terminée"}
              >
                {isQuestCompleted(currentQuest.id) ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <div className="w-4 h-4 border-2 border-white/40 rounded-full hover:border-white/60 transition-colors" />
                )}
              </button>
            </div>
            {currentQuest.description && (
              <div className="pr-8">
                <p className="text-white/80 text-xs">{displayDescription}</p>
                {isDescriptionLong && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-white/60 hover:text-white/80 text-xs mt-1 transition-colors"
                  >
                    {isDescriptionExpanded ? "Voir moins" : "Voir plus"}
                  </button>
                )}
              </div>
            )}

            {/* Navigation si plusieurs quêtes et carte étendue */}
            {hasMultipleQuests && (
              <div className="flex items-center justify-between mt-3">
                {/* Flèches de navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPrevious}
                    className="w-6 h-6 text-white/50 hover:text-white/80 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button onClick={goToNext} className="w-6 h-6 text-white/50 hover:text-white/80 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dots de navigation */}
                <div className="flex space-x-1">
                  {quests.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuest(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentQuestIndex ? "bg-white/80" : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
