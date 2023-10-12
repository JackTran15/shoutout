import { useInfiniteQuery } from "react-query";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { ApiErrorResponse, GetPersonalMessagesApiResponse } from "../types";
import { API_ENDPOINTS } from "../helpers";

export const useMessages = () => {
  const query = useInfiniteQuery({
    refetchOnMount: false,
    queryKey: ["getMessages"],

    queryFn: ({ pageParam = "?limit=10" }) =>
      authenticatedApiClient
        .get(API_ENDPOINTS.getPersonalMessages + pageParam)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(
            error?.response?.data?.message || "Something went wrong"
          );
        }),
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
