import { Constants } from "@/shared/constante/api-constante";
import { useApiAsync } from "../useApi";
import type { SynchUser } from "./api-user.type";

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
