import { Constants } from "@/shared/constante/api-constante";
import { useApi, useApiAsync } from "@/shared/services/useApi";
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

export const useGetSkill = (skillId: string) => {
  const enabled = Boolean(skillId && skillId.length > 0);
  const options = {
    method: "GET",
    url: `${Constants.API_BASE_URL}/skills/skill-9502e412-0ac7-43f0-adf8-2e739b136770`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const { data, isLoading: loading, error } = useApi<CreateSkillResponse>(options, ["skill", skillId], enabled);

  return {
    skill: data,
    loading,
    error,
  };
};
