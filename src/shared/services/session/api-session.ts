import { Constants } from "@/shared/constante/api-constante";
import type { CreateSessionInput, CreateSessionResponse, Session } from "./api-session.type";
import { useApi, useApiAsync } from "../useApi";

export const useCreateSession = () => {
  const options = {
    method: "POST",
    url: `${Constants.API_BASE_URL}/sessions`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const {
    mutateAsync: createSession,
    isPending: loading,
    error,
  } = useApiAsync<CreateSessionResponse, CreateSessionInput>(options, ["sessions"]);

  return {
    createSession,
    loading,
    error,
  };
};

export const useGetSessions = (userId: string) => {
  const options = {
    method: "GET",
    url: `${Constants.API_BASE_URL}/sessions/user/${userId}`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  const { data, isLoading: loading, error } = useApi<Session[]>(options, ["sessions", userId]);

  return {
    sessions: data,
    isPending: loading,
    error,
  };
};
