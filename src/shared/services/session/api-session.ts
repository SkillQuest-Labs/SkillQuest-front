import { Constants } from "@/shared/constante/api-constante";
import type {
  CreateSessionInput,
  CreateSessionResponse,
  Session,
  SessionsQuery,
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

export const useDeleteSession = (sessionId: string) => {
  const {
    mutateAsync: deleteSession,
    isPending,
    error,
  } = useApiAsync<void, void>(
    {
      method: "DELETE",
      url: `${Constants.API_BASE_URL}/sessions/${sessionId}`,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    },
    ["sessions"],
  );

  return { deleteSession, isPending, error };
};

export const useListSessions = (params: SessionsQuery) => {
  const { userId, skill = "", quest = "", date = "", page = 1, limit = 20 } = params;

  const search = new URLSearchParams();
  search.set("userId", userId); // ← IMPORTANT
  if (skill) search.set("skill", skill);
  if (quest) search.set("quest", quest);
  if (date) search.set("date", date);
  search.set("page", String(page));
  search.set("limit", String(limit));

  const url = `${Constants.API_BASE_URL}/sessions/filter?${search.toString()}`;

  const {
    data,
    isLoading: loading,
    error,
  } = useApi<{
    items: Session[];
    hasMore: boolean;
    nextCursor: string | null;
  }>(
    { method: "GET", url, headers: { "Content-Type": "application/json; charset=UTF-8" } },
    ["sessions", { userId, skill, quest, date, page, limit }],
    Boolean(userId), // ← n’appelle pas si userId vide
  );

  return {
    sessions: data?.items ?? [],
    hasMore: data?.hasMore ?? false,
    nextCursor: data?.nextCursor ?? null,
    loading,
    error,
  };
};
