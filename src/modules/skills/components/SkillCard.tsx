import type { Skill } from "../skills.types";
import "../../../styles/skills.css";
import { difficultyColors, statusColors, statusLabels } from "../skills.const";

type SkillCardProps = {
  skill: Skill;
};

export const SkillCard = ({ skill }: SkillCardProps) => (
  <div
    className="skill-card-custom group relative flex flex-col min-h-[260px] bg-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-300"
    tabIndex={0}
  >
    {/* Overlay lumineux fin autour de la carte */}
    <span className="absolute inset-0 pointer-events-none z-10" aria-hidden="true" />
    {/* Image de fond */}
    {skill.image && (
      <div className="relative w-full h-32">
        <img
          src={skill.image}
          alt={skill.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        />
        {/* Badges sur l'image */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
          <span className={`skill-badge-difficulty ${difficultyColors[skill.difficulty]} rounded-lg px-3 py-0.5 text-xs font-semibold shadow border border-opacity-20 whitespace-nowrap bg-white/80 backdrop-blur-sm`}>
            {skill.difficulty === "easy" ? "Easy" : skill.difficulty === "medium" ? "Medium" : "Hard"}
          </span>
          <span className={`skill-badge-difficulty ${statusColors[skill.status]} rounded-lg px-3 py-0.5 text-xs font-semibold shadow border border-opacity-20 whitespace-nowrap bg-white/80 backdrop-blur-sm`}>
            {statusLabels[skill.status]}
          </span>
        </div>
      </div>
    )}
    {/* Contenu principal */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-extrabold text-lg leading-tight line-clamp-2 mb-1 text-slate-100" title={skill.title}>
        {skill.title}
      </h3>
      <div className="text-sm text-slate-300 mb-3 line-clamp-2" title={skill.description}>
        {skill.description}
      </div>
      {/* Barre de progression */}
      {typeof skill.progress === "number" && (
        <div className="mb-3">
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 transition-all duration-700 ease-out"
              style={{ width: `${skill.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-300 mt-1 font-medium">
            <span>Progression</span>
            <span>{skill.progress}%</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700 text-xs text-slate-400">
        <span className="font-medium text-slate-300">{skill.category}</span>
        <span className="text-slate-500">{new Date(skill.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
    {/* Overlay lumineux focus-accessibilité et hover */}
    <span className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-200 group-hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.10)] group-focus-within:shadow-[0_0_8px_2px_rgba(56,189,248,0.25)]" />
  </div>
);
