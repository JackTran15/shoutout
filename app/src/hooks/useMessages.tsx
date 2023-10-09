import { useQuery } from "react-query";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { ApiErrorResponse } from "../types";

export const useMessages = () => {
  const query = useQuery({
    queryKey: ["getMessages"],
    queryFn: () =>
      authenticatedApiClient
        .get("/messages")
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(
            error?.response?.data?.message || "Something went wrong"
          );
        }),
    refetchOnMount: false,
  });

  return query;
};
