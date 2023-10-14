import { useInfiniteQuery } from "react-query";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { ApiErrorResponse, GetPersonalMessagesApiResponse } from "../types";
import { API_ENDPOINTS } from "../helpers";

export const useMessages = (enabled: boolean = true) => {
  const query = useInfiniteQuery({
    enabled,
    refetchOnMount: false,
    queryKey: ["getMessages"],

    queryFn: ({ pageParam = "?limit=10" }) => {
      console.log(
        "API_ENDPOINTS.getPersonalMessages + pageParam",
        API_ENDPOINTS.getPersonalMessages + pageParam
      );
      return authenticatedApiClient
        .get(API_ENDPOINTS.getPersonalMessages + pageParam)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(
            error?.response?.data?.message || "Something went wrong"
          );
        });
    },
    getNextPageParam: (
      lastPage: GetPersonalMessagesApiResponse,
      _allPages: GetPersonalMessagesApiResponse[]
    ) => {
      return lastPage.data.length < lastPage.limit
        ? undefined
        : `?limit=${lastPage.limit}&cursor=${
            lastPage.data[lastPage.data.length - 1]?._id
          }`;
    },
  });

  return query;
};
