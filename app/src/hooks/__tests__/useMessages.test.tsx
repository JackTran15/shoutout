import MockAdapter from "axios-mock-adapter";
import authenticatedApiClient from "../../api/authenticatedApiClient";
import { renderHook, waitFor } from "@testing-library/react";
import { useMessages } from "../useMessages";
import { QueryClient, QueryClientProvider } from "react-query";
import { API_ENDPOINTS, sleep } from "../../helpers";
import { useRegister } from "../useRegister";
import { act } from "react-dom/test-utils";

const queryClient = new QueryClient();

describe("useRegister hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(authenticatedApiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should have initial state", () => {
    mock.onGet(API_ENDPOINTS.getPersonalMessages).reply(200, "ok");
    const { result } = renderHook(() => useMessages(false), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.data).toBeFalsy();
    expect(result.current.error).toBeFalsy();
  });

  it("should get messages successfully", async () => {
    const responseData = {
      data: [
        {
          _id: "1",
          content: "message 1",
          author: "user_id",
          updatedAt: "2023-10-12T22:31:02.920Z",
          createdAt: "2023-10-12T22:31:02.920Z",
          __v: 0,
        },
        {
          _id: "2",
          content: "message 2",
          author: "user_id",
          updatedAt: "2023-10-12T22:31:02.920Z",
          createdAt: "2023-10-12T22:31:02.920Z",
          __v: 0,
        },
      ],
      total: 2,
      endCursor: "2",
      limit: "3",
    };

    mock.onGet("/messages/personal?limit=10").reply(200, responseData);

    let result: any;

    await act(async () => {
      result = renderHook(() => useMessages(), {
        // @ts-ignore
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      }).result;
    });

    expect(result.current.isLoading).toEqual(false);
    expect(result.current.data).toBeTruthy();
    expect(result.current.data).toEqual({
      pages: [responseData],
      pageParams: expect.any(Array),
    });
  });

  it("should handle unexpected errors", async () => {
    const failResponse = { message: "Something went wrong" };

    mock.onGet(API_ENDPOINTS.getPersonalMessages).reply(500, failResponse);
  });
});
