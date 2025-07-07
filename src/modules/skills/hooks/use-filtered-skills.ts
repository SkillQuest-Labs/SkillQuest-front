import { useMemo } from "react";
import { FilterStatus, FilterDifficulty, SortBy } from "../components/SkillsList";
import type { Skill } from "../skills.type";

export const useFilteredSkills = (
  skills: Skill[],
  searchQuery: string,
  statusFilter: FilterStatus,
  difficultyFilter: FilterDifficulty,
  sortBy: SortBy
) => {
  return useMemo(() => {
    const filtered = skills.filter((skill) => {
      const matchesSearch =
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category?.toLowerCase().includes(searchQuery.toLowerCase());

      // Map skill.status to French label for comparison
      const statusLabel =
        skill.status === "not_started"
          ? FilterStatus.NotStarted
          : skill.status === "in_progress"
          ? FilterStatus.InProgress
          : skill.status === "completed"
          ? FilterStatus.Completed
          : skill.status === "draft"
          ? FilterStatus.Draft
          : FilterStatus.All;

      const matchesStatus =
        statusFilter === FilterStatus.All || statusFilter === statusLabel;

      // Map skill.difficulty to French label for comparison
      const difficultyLabel =
        skill.difficulty === "Facile"
          ? FilterDifficulty.Easy
          : skill.difficulty === "Moyen"
          ? FilterDifficulty.Medium
          : skill.difficulty === "Difficile"
          ? FilterDifficulty.Hard
          : FilterDifficulty.All;

      const matchesDifficulty =
        difficultyFilter === FilterDifficulty.All || difficultyFilter === difficultyLabel;

      return matchesSearch && matchesStatus && matchesDifficulty;
    });

    // Sort skills
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case SortBy.Name:
          return a.title.localeCompare(b.title);
        case SortBy.Progress:
          return (b.progress || 0) - (a.progress || 0);
        case SortBy.Duration:
          return b.duration - a.duration;
        case SortBy.Updated:
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

    return sorted;
  }, [skills, searchQuery, statusFilter, difficultyFilter, sortBy]);
}; 