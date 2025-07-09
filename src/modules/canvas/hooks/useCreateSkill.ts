import { useMutation } from "@tanstack/react-query";
import { Constants } from "@/shared/constante/api-constante";

export type CreateSkillPayload = {
  title: string;
  description?: string;
  difficulty: string;
  userId: string;
};

export const useCreateSkill = () => {
  return useMutation({
    mutationFn: async (data: CreateSkillPayload) => {
      const res = await fetch(`${Constants.API_BASE_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la création");
      }

      return res.json();
    },
  });
};
