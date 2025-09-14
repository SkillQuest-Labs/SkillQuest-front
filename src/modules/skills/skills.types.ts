export type FilterSkillDifficulty = "EASY" | "MEDIUM" | "HARD" | "ALL";

export type FilterSkillStatus = "DRAFT" | "IN_PROGRESS" | "NOT_STARTED" | "COMPLETED" | "ALL";

export type SkillSort = "RECENT" | "OLDEST";

export type SkillFiltersType = {
  search: string;
  difficulty: FilterSkillDifficulty;
  sort: SkillSort;
  status: FilterSkillStatus;
};
