import { useQuery } from "react-query";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { ApiErrorResponse } from "../types";
import { API_ENDPOINTS } from "../helpers";

export const useMessages = () => {
  const query = useQuery({
    refetchOnMount: false,
    queryKey: ["getMessages"],
    queryFn: () =>
      authenticatedApiClient
        .get(API_ENDPOINTS.getPersonalMessages)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(
            error?.response?.data?.message || "Something went wrong"
          );
        }),
  });

  return query;
};
