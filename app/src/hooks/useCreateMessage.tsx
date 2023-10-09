import { useMutation } from "react-query";
import { ApiErrorResponse } from "../types";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { MessageSchema, messageSchema } from "../schemas/message";
import { API_ENDPOINTS } from "../helpers";

export const useCreateMessage = () => {
  const { mutateAsync, isLoading, data, error } = useMutation(
    async (input: MessageSchema) => {
      await messageSchema.validate(input).catch((error) => {
        throw new Error(error.errors[0]);
      });
      return authenticatedApiClient
        .post(API_ENDPOINTS.createMessage, input)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(
            error?.response?.data?.message || "Something went wrong"
          );
        });
    }
  );

  return { createMessage: mutateAsync, isLoading, data, error: error as Error };
};
