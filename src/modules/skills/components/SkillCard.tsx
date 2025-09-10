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
      <div className="session-card flex h-full flex-col bg-slate-800 rounded-2xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="truncate font-semibold text-slate-100 leading-tight">{skill.title}</h3>
          </div>

          {/* Statut compact à droite */}
          <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-300">
            {statusLabels[skill.status]}
          </span>
        </div>

        {/* Infos */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {typeof skill.progressValue === "number" && (
            <div className="rounded-full bg-slate-800/60 px-3 py-1">
              <span className="text-slate-400">Progression :</span>{" "}
              <span className="font-medium text-slate-100">{skill.progressValue}%</span>
            </div>
          )}
        </div>

        {/* Description */}
        {skill.description && <div className="mt-3 text-sm text-slate-400 line-clamp-2">{skill.description}</div>}

        {/* Barre de progression */}
        {typeof skill.progressValue === "number" && (
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400 transition-all duration-700 ease-out"
                style={{ width: `${skill.progressValue}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer actions (barre propre en bas) */}
        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-700/60">
          <Button
            onClick={handleCardClick}
            aria-label="Éditer le skill"
            className="btn-action btn-edit h-full w-full rounded-none bg-transparent text-slate-200 hover:text-white"
          >
            <Edit3 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline"></span>
          </Button>

          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            aria-label="Supprimer le skill"
            disabled={deleteLoading}
            className="btn-action btn-delete h-full w-full rounded-none bg-transparent text-slate-200 hover:text-white disabled:opacity-50"
          >
            {deleteLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
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
