import { Constants } from "@/shared/constante/api-constante";
import type { CreateSkillInput, CreateSkillResponse } from "@/shared/services/skill/api-skill.type";
import { useApiAsync } from "@/shared/services/useApi";

export const useCreateSkill = () => {
  const options = {
    method: "POST",
    url: `${Constants.API_BASE_URL}/skills`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const {
    mutateAsync: createSkill,
    isPending: loading,
    error,
  } = useApiAsync<CreateSkillResponse, CreateSkillInput>(options, ["skills"]);

  return {
    createSkill,
    loading,
    error,
  };
};
