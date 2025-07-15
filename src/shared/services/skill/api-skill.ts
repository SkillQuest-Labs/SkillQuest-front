import { Constants } from "@/shared/constante/api-constante";
import { useApiAsync } from "@/shared/services/useApi";
import type { CreateSkillInput, CreateSkillResponse } from "./api-skill.type";

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
  } = useApiAsync<CreateSkillResponse, CreateSkillInput>(options, ["skill"]);

  return {
    createSkill,
    loading,
    error,
  };
};
