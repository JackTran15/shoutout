import { useMutation } from "react-query";
import { apiClient } from "../api/apiClient";
import { ApiErrorResponse } from "../types";
import { clearAuthentication, saveAuthentication } from "../helpers";

export const useRefreshSession = () => {

  const { mutate, isLoading, data, error } = useMutation(() => {
    return apiClient
      .patch("/auth/refresh")
      .then((res) => res.data)
      .then((data) => {
        saveAuthentication(data);
        return data;
      })
      .catch((error: ApiErrorResponse) => {
        clearAuthentication();
        throw new Error(error?.response?.data.message);
      });
  });

  return {
    refreshSession: mutate,
    isLoading,
    data,
    error: error as Error,
  };
};
