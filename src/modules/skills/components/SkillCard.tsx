import type { Skill } from "../skills.types";
import { difficultyColors, statusColors, statusLabels } from "../skills.const";

type SkillCardProps = {
  skill: Skill;
};

export const SkillCard = ({ skill }: SkillCardProps) => (
  <div className="group relative flex flex-col bg-slate-800 cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-700/50">
    {/* Image de fond */}
    {skill.image && (
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={skill.image}
          alt={skill.title}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

        {/* Badges sur l'image */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
          <span
            className={`${difficultyColors[skill.difficulty]} rounded-full px-3 py-1 text-xs font-semibold shadow-lg border border-white/20 whitespace-nowrap bg-white/90 backdrop-blur-sm`}
          >
            {skill.difficulty === "easy" ? "Facile" : skill.difficulty === "medium" ? "Moyen" : "Difficile"}
          </span>
          <span
            className={`${statusColors[skill.status]} rounded-full px-3 py-1 text-xs font-semibold shadow-lg border border-white/20 whitespace-nowrap bg-white/90 backdrop-blur-sm`}
          >
            {statusLabels[skill.status]}
          </span>
        </div>
      </div>
    )}

    {/* Contenu principal */}
    <div className="p-6 flex flex-col flex-1">
      <h3
        className="font-bold text-lg leading-tight mb-3 text-white group-hover:text-blue-100 transition-colors duration-200"
        title={skill.title}
      >
        {skill.title}
      </h3>

      <p className="text-sm text-slate-300 mb-4 line-clamp-2 flex-1" title={skill.description}>
        {skill.description}
      </p>

      {/* Barre de progression */}
      {typeof skill.progress === "number" && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Progression</span>
            <span className="font-semibold">{skill.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${skill.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 text-xs">
        <span className="font-medium text-slate-300 bg-slate-700/50 px-2 py-1 rounded-md">{skill.category}</span>
        <span className="text-slate-500">
          {new Date(skill.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>

    {/* Overlay lumineux au hover */}
    <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
  </div>
);
