import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useCreateSkillModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isOpen = params.get("modal") === "create-skill";

  const openModal = useCallback(() => {
    navigate("/canvas?modal=create-skill");
  }, [navigate]);

  const closeModal = useCallback(() => {
    navigate("/canvas");
  }, [navigate]);

  return { isOpen, openModal, closeModal };
};
