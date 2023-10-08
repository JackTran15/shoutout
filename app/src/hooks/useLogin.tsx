import { useMutation } from "react-query";
import { apiClient } from "../api/apiClient";
import { HttpStatusCode } from "axios";
import { ApiErrorResponse } from "../types";
import { saveAuthentication } from "../helpers/auth";

export const useLogin = () => {
  const { mutate, isLoading, data, error } = useMutation(
    (input: { email: string; password: string }) => {
      return apiClient
        .put("/auth/login", input)
        .then((res) => res.data)
        .then((data) => {
          saveAuthentication(data);
          return data;
        })
        .catch((error: ApiErrorResponse) => {
          if (error?.response?.data.statusCode == HttpStatusCode.Unauthorized)
            throw new Error("Invalid username/password");
          throw new Error(
            error?.response?.data.message || "Something went wrong"
          );
        });
    }
  );

  return { login: mutate, isLoading, data, error: error as Error };
};
