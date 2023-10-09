import { renderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import MockAdapter from "axios-mock-adapter";
import { API_ENDPOINTS } from "../../helpers";
import { HttpStatusCode } from "axios";
import { MessageDTO } from "../../types";
import { useCreateMessage } from "../useCreateMessage";
import authenticatedApiClient from "../../api/authenticatedApiClient";

const queryClient = new QueryClient();

describe("usecreateMessage hook", () => {
  let mock: MockAdapter;

  const successReponse: MessageDTO = {
    content: "now now",
    author: "651f254064e51aa28bee5af0",
    updatedAt: "2023-10-09T16:29:48.918Z",
    createdAt: "2023-10-09T16:29:48.918Z",
    _id: "652442c93dcff4d0d2183260",
  };

  beforeEach(() => {
    mock = new MockAdapter(authenticatedApiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useCreateMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBeFalsy();
    expect(result.current.error).toBeFalsy();
  });

  it("should createMessage successfully", async () => {
    mock.onPost(API_ENDPOINTS.createMessage).reply(201, successReponse);

    const { result } = renderHook(() => useCreateMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.createMessage(
      { content: "Lorem" },
      {
        onSettled(data, error) {
          expect(data).toEqual(successReponse);
          expect(error).toBeFalsy();
        },
      }
    );
  });

  it("should handle error response", async () => {
    const failResponse = { message: "fail" };
    mock
      .onPost(API_ENDPOINTS.createMessage)
      .reply(HttpStatusCode.InternalServerError, failResponse);

    const { result } = renderHook(() => useCreateMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.createMessage({ content: "Lorem" }).catch((error) => {
      expect(error).toBeDefined();
      expect(result.current.data).toBeFalsy();
      expect((error as Error).message).toEqual(failResponse.message);
    });
  });

  it("Should validate payload before make api call", async () => {
    const failResponse = { message: "Something went wrong" };

    mock.onPut(API_ENDPOINTS.createMessage).reply(500, failResponse);

    const { result } = renderHook(() => useCreateMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.createMessage({} as any).catch((error) => {
      expect(error).toBeDefined();
      expect(result.current.data).toBeFalsy();
      expect((error as Error).message).not.toEqual(failResponse.message);
    });
  });
});
