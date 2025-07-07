import { useState } from "react";
import { useSkills } from "../hooks/use-skills";
import { useFilteredSkills } from "../hooks/use-filtered-skills";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { SkillCard } from "./SkillCard";
import { SkillsStats } from "./SkillsStats";
import { useNavigate } from "react-router-dom";
import { SparkleParticles } from "./SparkleParticles";
import { Difficulty, Status } from "../skills.type";

// Enums for filter values and labels in French
export enum FilterStatus {
  All = "Tous",
  NotStarted = "Non commencé",
  InProgress = "En cours",
  Completed = "Terminé",
  Draft = "Brouillon",
}

export enum FilterDifficulty {
  All = "Tous",
  Easy = "Facile",
  Medium = "Moyen",
  Hard = "Difficile",
}

export enum SortBy {
  Updated = "Plus récents",
  Name = "Nom",
  Progress = "Progression",
  Duration = "Durée",
}

export function SkillsList() {
  const { skills } = useSkills();
  const navigate = useNavigate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(FilterStatus.All);
  const [difficultyFilter, setDifficultyFilter] = useState<FilterDifficulty>(FilterDifficulty.All);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.Updated);

  // Utilisation du hook pour filtrer/tri
  const filteredSkills = useFilteredSkills(skills, searchQuery, statusFilter, difficultyFilter, sortBy);

  const handleSkillClick = (skillId: string) => {
    navigate(`${skillId}`);
  };

  const handleCreateSkill = () => {
    navigate("/canvas");
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-foreground flex items-center">🎯 Mes Skills</h1>
        <div className="relative w-[180px]">
          <SparkleParticles />
          <Button
            onClick={handleCreateSkill}
            size="sm"
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 w-full flex justify-center items-center text-base font-semibold"
          >
            <span className="relative z-10">Créer un skill</span>
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card border rounded-lg p-6">
        <SkillsStats skills={skills} />
      </div>

      {/* Filters Section */}
      <div className="bg-card border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rechercher</label>
            <Input
              placeholder="Rechercher un skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Statut</label>
            <Select
              value={statusFilter}
              onValueChange={(value: FilterStatus) => setStatusFilter(value as FilterStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FilterStatus).map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Difficulté</label>
            <Select
              value={difficultyFilter}
              onValueChange={(value: FilterDifficulty) => setDifficultyFilter(value as FilterDifficulty)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FilterDifficulty).map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Trier par</label>
            <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value as SortBy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SortBy).map((label) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Skills ({filteredSkills.length})</h2>
          {filteredSkills.length === 0 && <p className="text-muted-foreground">Aucun skill trouvé</p>}
        </div>

        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onClick={() => handleSkillClick(skill.id)}
                className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-xl font-semibold text-foreground">Aucun skill trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos filtres ou créez votre premier skill !</p>
            <Button onClick={handleCreateSkill} variant="outline">
              Créer mon premier skill
            </Button>
          </div>
        )}
      </div>

      {/* Bottom spacing to ensure scroll */}
      <div className="h-20"></div>
    </div>
  );
}
