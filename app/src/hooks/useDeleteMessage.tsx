import { useMutation } from "react-query";
import { ApiErrorResponse } from "../types";
import authenticatedApiClient from "../api/authenticatedApiClient";

export const useDeleteMessage = () => {
  const { mutate, isLoading, data, error } = useMutation((id: string) => {
    return authenticatedApiClient
      .delete("/messages/" + id)
      .then((res) => res.data)
      .catch((error: ApiErrorResponse) => {
        throw new Error(error?.response?.data.message);
      });
  });

  return { deleteMessage: mutate, isLoading, data, error: error as Error };
};
