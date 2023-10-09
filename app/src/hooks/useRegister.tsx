import { useMutation } from "react-query";
import { apiClient } from "../api/apiClient";
import { HttpStatusCode } from "axios";
import { ApiErrorResponse } from "../types";

export const useRegister = () => {
  const { mutate, isLoading, data, error } = useMutation(
    (input: { email: string; password: string }) => {
      return apiClient
        .post("/auth/register", input)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          if (error?.response?.data.statusCode == HttpStatusCode.Conflict)
            throw new Error("Account already exists");
          throw new Error(error?.response?.data.message);
        });
    }
  );

  return { register: mutate, isLoading, data, error: error as Error };
};
