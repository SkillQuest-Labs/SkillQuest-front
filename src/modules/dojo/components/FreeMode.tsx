import React, { useState } from "react";
import type { Quest } from "../types/dojo.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Clock, Star, Search, Play, Target, CheckCircle } from "lucide-react";

interface FreeModeProps {
  quests: Quest[];
  selectedQuests: Quest[];
  loading: boolean;
  onToggleQuest: (quest: Quest) => void;
  onClearSelection: () => void;
  onLaunchSession: () => void;
}

export const FreeMode: React.FC<FreeModeProps> = ({
  quests,
  selectedQuests,
  loading,
  onToggleQuest,
  onClearSelection,
  onLaunchSession,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  const getDifficultyColor = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "moyen":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "difficile":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getDifficultyIcon = (difficulty: Quest["difficulty"]) => {
    switch (difficulty) {
      case "facile":
        return "⭐";
      case "moyen":
        return "⭐⭐";
      case "difficile":
        return "⭐⭐⭐";
      default:
        return "⭐";
    }
  };

  // Filtrer les quêtes
  const filteredQuests = quests.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || quest.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des quêtes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Session Libre</h2>
        <p className="text-gray-400 text-sm">Choisissez librement les quêtes que vous souhaitez travailler</p>
      </div>

      {/* Filtres et recherche */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une quête..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2"
          >
            <option value="all">Toutes les difficultés</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>

        {/* Quêtes sélectionnées */}
        {selectedQuests.length > 0 && (
          <Card className="bg-green-900/20 border-green-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm">
                  {selectedQuests.length} quête{selectedQuests.length > 1 ? "s" : ""} sélectionnée
                  {selectedQuests.length > 1 ? "s" : ""}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={onClearSelection}
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-green-500/30 text-green-400 hover:bg-green-500/20"
                  >
                    Effacer
                  </Button>
                  <Button
                    onClick={onLaunchSession}
                    size="sm"
                    className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Lancer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {selectedQuests.map((quest) => (
                  <Badge key={quest.id} className="bg-green-500/20 text-green-400 border-green-500/30">
                    {quest.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Liste des quêtes */}
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Aucune quête trouvée</p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const isSelected = selectedQuests.some((q) => q.id === quest.id);

            return (
              <Card
                key={quest.id}
                className={`bg-slate-800/50 border-slate-700/50 transition-colors cursor-pointer ${
                  isSelected ? "ring-2 ring-green-500/50 bg-green-900/20" : "hover:bg-slate-700/50"
                }`}
                onClick={() => onToggleQuest(quest)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox checked={isSelected} onChange={() => onToggleQuest(quest)} className="mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium truncate">{quest.title}</h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">{quest.description}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {quest.isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                          <span className="text-2xl">{getDifficultyIcon(quest.difficulty)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={getDifficultyColor(quest.difficulty)}>{quest.difficulty}</Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {quest.estimatedTime}min
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Star className="w-3 h-3 mr-1" />
                          {quest.xp} XP
                        </Badge>
                      </div>

                      {quest.skills.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Compétences: {quest.skills.join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
