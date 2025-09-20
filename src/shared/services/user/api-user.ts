import { Constants } from "@/shared/constante/api-constante";
import { useApi, useApiAsync } from "../useApi";
import type { SynchUser, UserStats } from "./api-user.type";

export const useSynchUserApi = () => {
  const options = {
    method: "POST",
    url: `${Constants.API_BASE_URL}/user/synch`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const { mutateAsync: synchUser, isPending: loading, error } = useApiAsync<void, SynchUser>(options, ["user"]);

  return {
    synchUser,
    loading,
    error,
  };
};

export const useGetUserStats = (userId: string) => {
  const options = {
    method: "GET",
    url: `${Constants.API_BASE_URL}/user/${userId}/stats`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const { data, isLoading: loading, error } = useApi<UserStats>(options, ["user", userId]);

  return {
    userStats: data,
    loading,
    error,
  };
};
