import { useMutation } from "react-query";
import { ApiErrorResponse } from "../types";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { API_ENDPOINTS } from "../helpers";
import { useMessages } from "./useMessages";

export const useDeleteMessage = () => {
  const message = useMessages();
  const { mutate, isLoading, data, error } = useMutation((id: string) => {
    return authenticatedApiClient
      .delete(API_ENDPOINTS.deleteMessage(id))
      .then(async (res) => {
        await message.refetch()
        return res.data;
      })
      .catch((error: ApiErrorResponse) => {
        throw new Error(error?.response?.data.message);
      });
  });

  return { deleteMessage: mutate, isLoading, data, error: error as Error };
};
