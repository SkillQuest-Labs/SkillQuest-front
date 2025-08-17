import { Constants } from "@/shared/constante/api-constante";
import { useApi, useApiAsync } from "@/shared/services/useApi";
import type { CreateSkillInput, CreateSkillResponse, UpdateSkillInput, UpdateSkillResponse } from "./api-skill.type";
import type { Skill } from "@/shared/types/skill.type";

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

export const useUpdateSkill = (skillId: string, userId: string) => {
  const {
    mutateAsync: updateSkill,
    isPending: loading,
    error,
  } = useApiAsync<UpdateSkillResponse, UpdateSkillInput>(
    {
      method: "PUT",
      url: `${Constants.API_BASE_URL}/skills/${skillId}`,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    },
    ["skills", userId],
  );

  return { updateSkill, loading, error };
};

export const useGetSkill = (skillId: string) => {
  const enabled = Boolean(skillId && skillId.length > 0);
  const options = {
    method: "GET",
    url: `${Constants.API_BASE_URL}/skills/${skillId}`,
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

export const useGetSkills = (userId: string) => {
  const options = {
    method: "GET",
    url: `${Constants.API_BASE_URL}/skills/user/${userId}`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const { data, isLoading: loading, error } = useApi<Skill[]>(options, ["skills", userId]);

  return {
    skills: data || [],
    loading,
    error,
  };
};

export const useDeleteSkill = (skillId: string) => {
  const {
    mutateAsync: deleteSkill,
    isPending: loading,
    error,
  } = useApiAsync<void, void>(
    {
      method: "DELETE",
      url: `${Constants.API_BASE_URL}/skills/${skillId}`,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    },
    ["skill", skillId],
  );

  return { deleteSkill, loading, error };
};
