import type { Skill } from "../skills.types";
import "../../../styles/skills.css";
import { statusColors, statusLabels } from "../skills.const";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Edit3, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteSkill } from "@/shared/services/skill/api-skill";
import { showToast } from "@/component/notification/show-toast";

type SkillCardProps = {
  skill: Skill;
};

export const SkillCard = ({ skill }: SkillCardProps) => {
  const navigate = useNavigate();
  const { deleteSkill, loading: deleteLoading } = useDeleteSkill(skill.skillId || skill.id || "");

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/dashboard/skills/${skill.skillId || skill.id}`);
  };

  const handleCardClick = () => {
    navigate(`/dashboard/skills/${skill.skillId || skill.id}`);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce skill ? Cette action est irréversible.")) {
      try {
        await deleteSkill();
        showToast({
          title: "Succès",
          description: "Le skill a été supprimé avec succès",
          status: "success",
        });
        // Recharger la page ou mettre à jour la liste
        window.location.reload();
      } catch (error) {
        showToast({
          title: "Erreur",
          description: "Erreur lors de la suppression du skill",
          status: "error",
        });
      }
    }
  };

  return (
    <div
      className="skill-card-custom skill-card-min group relative flex flex-col bg-slate-800 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-300 min-h-[340px] h-full cursor-pointer"
      tabIndex={0}
      onClick={handleCardClick}
    >
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
            <span
              className={`skill-badge-difficulty ${statusColors[skill.status]} rounded-lg px-3 py-0.5 text-xs font-semibold shadow border border-opacity-20 whitespace-nowrap bg-white/80 backdrop-blur-sm`}
            >
              {statusLabels[skill.status]}
            </span>
          </div>
        </div>
      )}
      {/* Contenu principal */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-base leading-tight line-clamp-2 mb-1 text-slate-200" title={skill.title}>
          {skill.title}
        </h3>
        <div className="text-xs text-slate-400 mb-3 line-clamp-2" title={skill.description}>
          {skill.description}
        </div>
        {/* Barre de progression */}
        {typeof skill.progressValue === "number" && (
          <div className="mb-3">
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 transition-all duration-700 ease-out"
                style={{ width: `${skill.progressValue}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-300 mt-1 font-medium">
              <span>Progression</span>
              <span>{skill.progressValue}%</span>
            </div>
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 text-xs">
          <Badge className="bg-slate-700/50 text-slate-300 font-medium px-2 py-0.5 rounded-md text-xs max-w-[100px] whitespace-nowrap truncate">
            {/* {skill.category.length > 12 ? skill.category.slice(0, 12) + "…" : skill.category} */}
          </Badge>
          <span className="text-slate-500">
            {/* {new Date(skill.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })} */}
          </span>
        </div>
      </div>

      {/* Bouton d'édition */}
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800/80 hover:bg-slate-700/80 text-white z-20 w-8 h-8 p-0"
        onClick={handleEditClick}
      >
        <Edit3 size={12} />
      </Button>

      {/* Bouton de suppression */}
      <Button
        size="sm"
        variant="ghost"
        disabled={deleteLoading}
        className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white hover:bg-gray-100 text-gray-600 z-40 w-7 h-7 p-0 rounded-full shadow-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleDeleteClick}
      >
        {deleteLoading ? (
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <X size={12} />
        )}
      </Button>

      {/* Overlay lumineux fin autour de la carte */}
      <span className="absolute inset-0 pointer-events-none z-10" aria-hidden="true" />
      {/* Overlay lumineux au hover */}
    </div>
  );
};
