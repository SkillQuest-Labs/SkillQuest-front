import React from 'react';
import type { Skill } from '../skills.types';
import { SkillDifficulty } from '../skills.types';

interface SkillCardProps {
  skill: Skill;
}

const difficultyColors = {
  [SkillDifficulty.Easy]: 'bg-green-100 text-green-800',
  [SkillDifficulty.Medium]: 'bg-yellow-100 text-yellow-800',
  [SkillDifficulty.Hard]: 'bg-red-100 text-red-800',
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill }) => (
  <div className="rounded-xl shadow bg-white overflow-hidden flex flex-col min-h-[180px] p-4">
    <div className="flex items-center gap-2 mb-1">
      <h3 className="font-semibold text-base truncate flex-1" title={skill.title}>{skill.title}</h3>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[skill.difficulty]}`}>{
        skill.difficulty === SkillDifficulty.Easy ? 'Facile' : skill.difficulty === SkillDifficulty.Medium ? 'Moyen' : 'Difficile'
      }</span>
    </div>
    <div className="text-xs text-gray-500 truncate mb-2" title={skill.description}>{skill.description}</div>
    <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
      <span>📂 {skill.category}</span>
    </div>
  </div>
); 