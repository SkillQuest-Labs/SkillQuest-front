import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteSkill } from "@/shared/services/skill/api-skill";
import { showToast } from "@/component/notification/show-toast";
import type { Skill } from "@/shared/types/skill.type";

export const useSkillCardActions = (skill: Skill) => {
  const navigate = useNavigate();
  const { deleteSkill, loading: deleteLoading } = useDeleteSkill(skill.skillId || skill.id || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCardClick = useCallback(() => {
    navigate(`/dashboard/skills/${skill.skillId || skill.id}`);
  }, [navigate, skill.skillId, skill.id]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
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
  }, [deleteSkill]);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  return {
    handleCardClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleCloseDeleteDialog,
    isDeleteDialogOpen,
    deleteLoading,
  };
};
