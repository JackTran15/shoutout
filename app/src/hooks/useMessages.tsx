import { useInfiniteQuery, useQuery } from "react-query";
import authenticatedApiClient from "../api/authenticatedApiClient";
import { ApiErrorResponse } from "../types";
import { API_ENDPOINTS } from "../helpers";

export const useMessages = () => {
  const query = useInfiniteQuery({
    refetchOnMount: false,
    queryKey: ["getMessages"],

    queryFn: ({ pageParam = "?skip=0&limit=10" }) =>
      authenticatedApiClient
        .get(API_ENDPOINTS.getPersonalMessages + pageParam)
        .then((res) => res.data)
        .catch((error: ApiErrorResponse) => {
          throw new Error(
            error?.response?.data?.message || "Something went wrong"
          );
        }),
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const loaded = +lastPage.skip + +lastPage.limit;
      const total = +lastPage.total;

      return loaded > +total
        ? undefined
        : `?skip=${loaded}&limit=${lastPage.limit}`;
    },
  });

  return query;
};
