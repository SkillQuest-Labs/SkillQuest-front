import { useAuth } from "@clerk/clerk-react";
import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

// Used to perform retrieval requests without modification (GET)
export const useApi = <TResult>(
  options: RequestInit & { url: string } = { url: "" },
  cacheKey: unknown[] = [options.url],
  enabled: boolean = true,
  queryOption?: Omit<UseQueryOptions<TResult, Error, TResult, unknown[]>, "queryKey" | "queryFn">,
): { error?: Error; isLoading: boolean; data?: TResult } => {
  const { getToken } = useAuth();

  const fetchData = async () => {
    let accessToken;
    try {
      accessToken = await getToken();
    } catch {
      throw new Error("Access token not found");
    }

    if (accessToken) {
      const res = await fetch(options.url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status !== 200 && res.status !== 201) {
        const error = await res.json();
        throw error;
      } else {
        const data = await res.json();
        return data;
      }
    } else {
      throw new Error("Access token not found");
    }
  };

  const { isLoading, data, error } = useQuery<TResult, Error, TResult, unknown[]>({
    queryKey: cacheKey,
    enabled,
    queryFn: fetchData,
    ...queryOption,
  });

  return { error: error || undefined, isLoading, data };
};

// Used to perform requests that modify data (POST, PUT, DELETE)
export const useApiAsync = <TResult, TVars = void>(
  fetchOptions: RequestInit & { url: string },
  cacheKey?: unknown[],
  queryOptions?: UseMutationOptions<TResult, Error, TVars>,
) => {
  const { getToken } = useAuth();

  const fetchData = async (body: TVars): Promise<TResult> => {
    let accessToken;

    try {
      accessToken = await getToken();
    } catch {
      throw new Error("Access token not found");
    }

    if (accessToken) {
      const res = await fetch(fetchOptions.url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
        body: body != null ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const error = await res.json();
        throw error;
      }

      const data = await res.json();
      return data as Promise<TResult>;
    } else {
      throw new Error("Access token not found");
    }
  };

  const queryClient = useQueryClient();

  if (!cacheKey) {
    cacheKey = [fetchOptions.url];
  }

  const { mutateAsync, isPending, error, data } = useMutation<TResult, Error, TVars>({
    mutationFn: fetchData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey });
    },
    ...queryOptions,
  });

  return { mutateAsync, isPending, error, data };
};
