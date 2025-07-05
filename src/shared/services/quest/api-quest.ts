import { Constants } from "@/shared/constante/api-constante";
import type {
  CreateQuestInput,
  CreateQuestsResponse,
  GetQuestsResponse,
  UpdateQuestInput,
  UpdateQuestsResponse,
} from "./api-quest.type";
import { useApi, useApiAsync } from "../useApi";

export const useGetQuests = (skillId: string) => {
  const options = {
    method: "GET",
    url: `${Constants.API_BASE_URL}/quests/${skillId}`,
  };

  const { data, isLoading: loading, error } = useApi<GetQuestsResponse>(options, ["quests"]); // add the userId to the cache key

  return {
    quests: data?.quests,
    total: data?.total,
    loading,
    error: error,
  };
};

export const useCreateQuests = () => {
  const options = {
    method: "POST",
    url: `${Constants.API_BASE_URL}/quests`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const {
    mutateAsync: createQuest,
    isPending: loading,
    error,
  } = useApiAsync<CreateQuestsResponse, CreateQuestInput[]>(options, ["quests"]);

  return {
    createQuest,
    loading,
    error,
  };
};

export const useUpdateQuests = () => {
  const options = {
    method: "PUT",
    url: `${Constants.API_BASE_URL}/quests`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const {
    mutateAsync: updateQuest,
    isPending: loading,
    error,
  } = useApiAsync<UpdateQuestsResponse, UpdateQuestInput[]>(options, ["quests"]);

  return {
    updateQuest,
    loading,
    error,
  };
};
