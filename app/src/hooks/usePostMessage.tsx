import { useMutation } from "react-query";
import { apiClient } from "../api/apiClient";
import { HttpStatusCode } from "axios";
import { ApiErrorResponse } from "../types";
import authenticatedApiClient from "../api/authenticatedApiClient";

export const usePostMessage = () => {
  const { mutate, isLoading, data, error } = useMutation(
    (input: { content: string }) => {
      return authenticatedApiClient
        .post("/messages/create", input)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(error?.response?.data.message);
        });
    }
  );

  return { postMessage: mutate, isLoading, data, error: error as Error };
};
