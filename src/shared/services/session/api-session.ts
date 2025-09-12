import { Constants } from "@/shared/constante/api-constante";
import type {
  CreateSessionInput,
  CreateSessionResponse,
  Session,
  UpdateSessionInput,
  UpdateSessionResponse,
} from "./api-session.type";
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

export const useUpdateSession = (sessionId: string) => {
  const options = {
    method: "PUT",
    url: `${Constants.API_BASE_URL}/sessions/${sessionId}`,
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };

  const {
    mutateAsync: updateSession,
    isPending: loading,
    error,
  } = useApiAsync<UpdateSessionResponse, UpdateSessionInput>(options, ["sessions"]);

  return { updateSession, loading, error };
};

export const useDeleteSession = () => {
  const deleteSession = async (id: string): Promise<void> => {
    const res = await fetch(`${Constants.API_BASE_URL}/sessions/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
    if (!res.ok) {
      const errorMessage = await res.text().catch(() => "");
      throw new Error(errorMessage || "Delete session failed");
    }
  };
  return { deleteSession };
};
