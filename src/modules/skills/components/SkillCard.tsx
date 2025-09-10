import "../../../styles/skills.css";
import "../../../styles/SkillCard.css";
import { SKILL_CARD_CONSTANTS, SKILL_CARD_ACTIONS, SKILL_CARD_PROGRESS } from "../skills.const";
import { Button } from "@/shared/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import type { Skill } from "@/shared/types/skill.type";
import { ConfirmDeleteDialogue } from "@/component/confirm-dialogue/ConfirmDeleteDialogue";
import { useSkillCardActions } from "../hooks/useSkillCardActions";
import { useSkillCardImage } from "../hooks/useSkillCardImage";
import { useSkillCardProgress } from "../hooks/useSkillCardProgress";
import { useSkillCardOptimization } from "../hooks/useSkillCardOptimization";
import { memo } from "react";

type SkillCardProps = {
  skill: Skill;
};

const SkillCardComponent = ({ skill }: SkillCardProps) => {
  const {
    handleCardClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleCloseDeleteDialog,
    isDeleteDialogOpen,
    deleteLoading,
  } = useSkillCardActions(skill);

  const { imageStyle, hasImage } = useSkillCardImage(skill);
  const { progressValue, hasProgress, progressPercentage } = useSkillCardProgress(skill);
  const { statusLabel, hasDescription, getDeleteMessage } = useSkillCardOptimization(skill);

  return (
    <>
      {/* Carte en colonne: header → infos → footer */}
      <div className={`session-card flex h-full flex-col ${SKILL_CARD_CONSTANTS.CARD_BORDER_RADIUS} overflow-hidden`}>
        {/* Image de fond avec bords arrondis */}
        <div
          className={`skill-card-image absolute inset-0 ${SKILL_CARD_CONSTANTS.CARD_BORDER_RADIUS} overflow-hidden`}
          style={imageStyle}
          data-loading={!hasImage}
        />

        {/* Overlay dégradé vers le bas */}
        <div
          className={`skill-card-overlay absolute inset-0 bg-gradient-to-b ${SKILL_CARD_CONSTANTS.OVERLAY_GRADIENT} pointer-events-none ${SKILL_CARD_CONSTANTS.CARD_BORDER_RADIUS}`}
        ></div>

        {/* Contenu avec z-index pour être au-dessus du dégradé */}
        <div className="skill-card-content relative z-10 flex h-full flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <h3
                className={`skill-card-title truncate font-semibold text-white leading-tight ${SKILL_CARD_CONSTANTS.TEXT_SHADOW}`}
              >
                {skill.title}
              </h3>
            </div>

            {/* Statut compact à droite */}
            <span
              className={`rounded-full bg-black/40 ${SKILL_CARD_CONSTANTS.BACKDROP_BLUR} px-3 py-1 text-xs text-white ${SKILL_CARD_CONSTANTS.BORDER_OPACITY}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Infos */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            {hasProgress && (
              <div className={SKILL_CARD_PROGRESS.CONTAINER}>
                <span className="text-slate-200">Progression :</span>{" "}
                <span className="font-medium text-white">{progressValue}%</span>
              </div>
            )}
          </div>

          {/* Description */}
          {hasDescription && (
            <div className={`mt-3 text-sm text-slate-200 ${SKILL_CARD_CONSTANTS.LINE_CLAMP} drop-shadow-md`}>
              {skill.description}
            </div>
          )}

          {/* Barre de progression */}
          {hasProgress && (
            <div className="mt-4">
              <div className={SKILL_CARD_PROGRESS.BAR_CONTAINER}>
                <div
                  className={`skill-card-progress-bar ${SKILL_CARD_PROGRESS.BAR_FILL}`}
                  style={{ width: progressPercentage }}
                />
              </div>
            </div>
          )}

          {/* Footer actions (barre propre en bas) */}
          <div className={`skill-card-actions ${SKILL_CARD_ACTIONS.CONTAINER}`}>
            <Button onClick={handleCardClick} aria-label="Éditer le skill" className={SKILL_CARD_ACTIONS.EDIT_BUTTON}>
              <Edit3 className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline"></span>
            </Button>

            <Button
              onClick={handleDeleteClick}
              aria-label="Supprimer le skill"
              disabled={deleteLoading}
              className={SKILL_CARD_ACTIONS.DELETE_BUTTON}
            >
              {deleteLoading ? <div className={SKILL_CARD_ACTIONS.LOADING_SPINNER} /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialogue
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={handleCloseDeleteDialog}
        messageDialogue={getDeleteMessage()}
        deleteLoading={deleteLoading}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

// Export du composant mémorisé pour optimiser les performances
export const SkillCard = memo(SkillCardComponent);