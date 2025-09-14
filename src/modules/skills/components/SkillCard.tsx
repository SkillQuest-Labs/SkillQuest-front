import "../../../styles/skills.css";
import { statusLabels } from "../skills.const";
import { Button } from "@/shared/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteSkill } from "@/shared/services/skill/api-skill";
import { showToast } from "@/component/notification/show-toast";
import { useState } from "react";
import type { Skill } from "@/shared/types/skill.type";
import { ConfirmDeleteDialogue } from "@/component/confirm-dialogue/ConfirmDeleteDialogue";
import forestImage from "../../../assets/skills/forest.webp";

type SkillCardProps = {
  skill: Skill;
};

export const SkillCard = ({ skill }: SkillCardProps) => {
  const navigate = useNavigate();
  const { deleteSkill, loading: deleteLoading } = useDeleteSkill(skill.skillId || skill.id || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCardClick = () => {
    navigate(`/dashboard/skills/${skill.skillId || skill.id}`);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSkill();

      showToast({
        title: "Succès",
        description: "Le skill a été supprimé avec succès",
        status: "success",
      });
      setIsDeleteDialogOpen(false);
    } catch {
      showToast({
        title: "Erreur",
        description: "Erreur lors de la suppression du skill",
        status: "error",
      });
    }
  };

  return (
    <>
      {/* Carte en colonne: header → infos → footer */}
      <div className="session-card flex h-full flex-col rounded-2xl overflow-hidden">
        {/* Image de fond avec bords arrondis */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backgroundImage: skill.imageUrl 
              ? `url(${skill.imageUrl})` 
              : `url(${forestImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay dégradé vers le bas */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/50 to-slate-900/90 pointer-events-none rounded-2xl"></div>
        
        {/* Contenu avec z-index pour être au-dessus du dégradé */}
        <div className="relative z-10 flex h-full flex-col p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="truncate font-semibold text-white leading-tight drop-shadow-lg">{skill.title}</h3>
          </div>

          {/* Statut compact à droite */}
          <span className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 text-xs text-white border border-white/20">
            {statusLabels[skill.status]}
          </span>
        </div>

        {/* Infos */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {typeof skill.progressValue === "number" && (
            <div className="rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 border border-white/20">
              <span className="text-slate-200">Progression :</span>{" "}
              <span className="font-medium text-white">{skill.progressValue}%</span>
            </div>
          )}
        </div>

        {/* Description */}
        {skill.description && <div className="mt-3 text-sm text-slate-200 line-clamp-2 drop-shadow-md">{skill.description}</div>}

        {/* Barre de progression */}
        {typeof skill.progressValue === "number" && (
          <div className="mt-4">
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 transition-all duration-700 ease-out"
                style={{ width: `${skill.progressValue}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer actions (barre propre en bas) */}
        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-white/20 bg-black/40 backdrop-blur-sm">
          <Button
            onClick={handleCardClick}
            aria-label="Éditer le skill"
            className="btn-action btn-edit h-full w-full rounded-l-lg rounded-r-none bg-transparent text-white hover:text-white hover:bg-white/10 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline"></span>
          </Button>

          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Supprimer le skill"
            disabled={deleteLoading}
            className="btn-action btn-delete h-full w-full rounded-r-lg rounded-l-none bg-transparent text-white hover:text-white hover:bg-red-500/20 disabled:opacity-50 transition-colors"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        </div>
      </div>

      <ConfirmDeleteDialogue
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        messageDialogue={`Êtes-vous sûr de vouloir supprimer le skill ${skill.title} ? Cette action est irréversible.`}
        deleteLoading={deleteLoading}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};
