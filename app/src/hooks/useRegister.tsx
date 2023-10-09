import { useMutation } from "react-query";
import { apiClient } from "../api/apiClient";
import { HttpStatusCode } from "axios";
import { ApiErrorResponse } from "../types";
import { RegisterSchema, registerSchema } from "../schemas";
import { API_ENDPOINTS } from "../helpers";

export const useRegister = () => {
  const { mutateAsync, isLoading, data, error } = useMutation(
    async (input: RegisterSchema) => {
      await registerSchema.validate(input);
      return apiClient
        .post(API_ENDPOINTS.register, input)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          if (error?.response?.data?.statusCode == HttpStatusCode.Conflict)
            throw new Error("Account already exists");
          throw new Error(error?.response?.data?.message);
        });
    }
  );

  return { register: mutateAsync, isLoading, data, error: error as Error };
};
