import { useState, useMemo } from "react";
import { useSkills } from "../hooks/use-skills";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SkillCard } from "./SkillCard";
import { SkillsStats } from "./SkillsStats";
import { useNavigate } from "react-router-dom";

type FilterStatus =
  | "all"
  | "not_started"
  | "in_progress"
  | "completed"
  | "draft";
type FilterDifficulty = "all" | "Facile" | "Moyen" | "Difficile";

export function SkillsList() {
  const { skills } = useSkills();
  const navigate = useNavigate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<FilterDifficulty>("all");
  const [sortBy, setSortBy] = useState<
    "name" | "progress" | "duration" | "updated"
  >("updated");

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    const filtered = skills.filter((skill) => {
      const matchesSearch =
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || skill.status === statusFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || skill.difficulty === difficultyFilter;

      return matchesSearch && matchesStatus && matchesDifficulty;
    });

    // Sort skills
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        case "duration":
          return b.duration - a.duration;
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [skills, searchQuery, statusFilter, difficultyFilter, sortBy]);

  const handleSkillClick = (skillId: string) => {
    navigate(`/skills/${skillId}`);
  };

  const handleCreateSkill = () => {
    navigate("/canvas");
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              🎯 Mes Skills
            </h1>
            <p className="text-muted-foreground">
              Organisez votre apprentissage avec des arbres de compétences
              ludiques
            </p>
          </div>

          <Button
            onClick={handleCreateSkill}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            <span className="mr-2">✨</span>
            Créer un skill
          </Button>
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
              <label className="text-sm font-medium text-foreground">
                Rechercher
              </label>
              <Input
                placeholder="Rechercher un skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Statut
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value: FilterStatus) => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="not_started">Non commencés</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Difficulté
              </label>
              <Select
                value={difficultyFilter}
                onValueChange={(value: FilterDifficulty) =>
                  setDifficultyFilter(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les difficultés</SelectItem>
                  <SelectItem value="Facile">Facile</SelectItem>
                  <SelectItem value="Moyen">Moyen</SelectItem>
                  <SelectItem value="Difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Trier par
              </label>
              <Select
                value={sortBy}
                onValueChange={(
                  value: "name" | "progress" | "duration" | "updated",
                ) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Plus récents</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="progress">Progression</SelectItem>
                  <SelectItem value="duration">Durée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Skills ({filteredSkills.length})
            </h2>
            {filteredSkills.length === 0 && (
              <p className="text-muted-foreground">Aucun skill trouvé</p>
            )}
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
              <h3 className="text-xl font-semibold text-foreground">
                Aucun skill trouvé
              </h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres ou créez votre premier skill !
              </p>
              <Button onClick={handleCreateSkill} variant="outline">
                Créer mon premier skill
              </Button>
            </div>
          )}
        </div>

        {/* Bottom spacing to ensure scroll */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}
