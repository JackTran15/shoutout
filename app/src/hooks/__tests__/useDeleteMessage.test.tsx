import { renderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { useDeleteMessage } from "../useDeleteMessage";
import MockAdapter from "axios-mock-adapter";
import { authenticatedApiClient } from "../../api/authenticatedApiClient";
import { API_ENDPOINTS } from "../../helpers";
import { act } from "react-dom/test-utils";

const queryClient = new QueryClient();

describe("useDeleteMessage hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(authenticatedApiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("Should enable loading when starting to call api", async () => {
    mock = new MockAdapter(authenticatedApiClient, { delayResponse: 3000 });
    mock.onDelete(API_ENDPOINTS.deleteMessage("id")).reply(200, "ok");

    const { result } = renderHook(() => useDeleteMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    result.current.deleteMessage("id");
    await act(async () => {}); //wait for state changes
    expect(result.current.isLoading).toEqual(true);
  });

  it("Should return data but not error when api return success", async () => {
    mock.onDelete(API_ENDPOINTS.deleteMessage("id")).reply(200, "Deleted");

    const { result, waitFor } = renderHook(() => useDeleteMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    result.current.deleteMessage("id", {
      onSettled(data, error, variables, context) {
        expect(variables).toEqual("id");
        expect(data).toBeTruthy();
        expect(error).toBeFalsy();
      },
    });
  });

  it("Should return error but not data when api return fail", async () => {
    mock.onDelete("/messages/id").reply(500, "Failed");

    const { result, waitFor } = renderHook(() => useDeleteMessage(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    result.current.deleteMessage("id", {
      onSettled(data, error, variables, context) {
        expect(data).toBeFalsy();
        expect(error).toBeTruthy();
      },
    });
  });
});
