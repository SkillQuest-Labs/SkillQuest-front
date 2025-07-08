import React from 'react';
import { SkillDifficulty } from '../skills.types';

interface SkillFiltersProps {
  difficulty: SkillDifficulty | 'all';
  sort: 'recent' | 'oldest';
  onFilterChange: (filters: { difficulty: SkillDifficulty | 'all'; sort: 'recent' | 'oldest' }) => void;
}

export const SkillFilters: React.FC<SkillFiltersProps> = ({ difficulty, sort, onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-6 items-end">
      <div>
        <label className="block text-xs font-medium mb-1">Difficulté</label>
        <select
          className="border rounded px-2 py-1"
          value={difficulty}
          onChange={e => onFilterChange({ difficulty: e.target.value as SkillDifficulty | 'all', sort })}
        >
          <option value="all">Toutes</option>
          <option value={SkillDifficulty.Easy}>Facile</option>
          <option value={SkillDifficulty.Medium}>Moyen</option>
          <option value={SkillDifficulty.Hard}>Difficile</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1">Trier par</label>
        <select
          className="border rounded px-2 py-1"
          value={sort}
          onChange={e => onFilterChange({ difficulty, sort: e.target.value as 'recent' | 'oldest' })}
        >
          <option value="recent">Plus récent</option>
          <option value="oldest">Moins récent</option>
        </select>
      </div>
    </div>
  );
}; 