import { useMutation } from "react-query";
import { apiClient } from "../api/apiClient";
import { HttpStatusCode } from "axios";
import { ApiErrorResponse, Auth } from "../types";
import { LoginSchema, loginSchema } from "../schemas/auth";
import { API_ENDPOINTS, saveAuthentication } from "../helpers";

export interface LoginResponse {
  accessToken: string;
  account: Auth;
}

export const useLogin = () => {
  const { isLoading, data, error, mutateAsync } = useMutation(
    async (input: LoginSchema) => {
      await loginSchema.validate(input).catch((error) => {
        throw new Error(error.errors[0]);
      });
      const res = await apiClient
        .put<LoginResponse>(API_ENDPOINTS.login, input)
        .catch((error) => {
          if (error?.response?.data.statusCode == HttpStatusCode.Unauthorized)
            throw new Error("Invalid username/password");
          throw new Error(error?.response?.data.message);
        });

      saveAuthentication(res.data);
      return res.data;
    }
  );

  return { login: mutateAsync, isLoading, data, error: error as Error };
};
