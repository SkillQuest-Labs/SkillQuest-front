import { ConstantsApi } from "@/shared/constante/constante";
import type { GetQuestResponse } from "./api-quest.type";
import { useApi } from "../useApi";

export const useGetQuests = (skillId: string) => {
  const options = {
    method: "GET",
    url: `${ConstantsApi.API_BASE_URL}/quests/${skillId}`,
  };

  const { data, isLoading: loading, error } = useApi<GetQuestResponse>(options, ["quests"]); // add the userId to the cache key

  return {
    quests: data?.quests,
    total: data?.total,
    isLoading: loading,
    error: error,
  };
};
