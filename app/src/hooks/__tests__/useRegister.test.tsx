import { renderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { apiClient } from "../../api/apiClient";
import MockAdapter from "axios-mock-adapter";
import { API_ENDPOINTS, sleep } from "../../helpers";
import { Auth } from "../../types";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/react";
import { HttpStatusCode } from "axios";
import { useRegister } from "../useRegister";
import { RegisterSchema } from "../../schemas";

const queryClient = new QueryClient();

describe("useRegister hook", () => {
  let mock: MockAdapter;

  const input: RegisterSchema = {
    email: "jack@sss.com",
    password: "456987",
    confirmPassword: "456987",
  };

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should have initial state", () => {
    const { result } = renderHook(() => useRegister(), {
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

  it("should register successfully", async () => {
    mock.onPost(API_ENDPOINTS.register).reply(200, "ok");

    const { result } = renderHook(() => useRegister(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.register(input, {
      onSettled(data, error) {
        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
      },
    });
  });

  it("should handle unexpected errors", async () => {
    const failResponse = { message: "Something went wrong" };

    mock.onPost(API_ENDPOINTS.register).reply(500, failResponse);

    const { result } = renderHook(() => useRegister(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.register(input).catch((error) => {
      expect(error).toBeDefined();
      expect(result.current.data?.accessToken).toBeFalsy();
      expect(result.current.data?.account.email).toBeFalsy();
      expect(result.current.data?.account._id).toBeFalsy();
      expect((error as Error).message).toEqual(failResponse.message);
    });
  });

  it("should validate input before call api", async () => {
    const failResponse = { message: "Something went wrong" };

    mock.onPost(API_ENDPOINTS.register).reply(500, failResponse);

    const { result } = renderHook(() => useRegister(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current
      .register({
        email: "jack@gmail.com",
        password: "123456789",
      } as any)
      .catch((error) => {
        expect(error).toBeDefined();
        expect(result.current.data?.accessToken).toBeFalsy();
        expect(result.current.data?.account.email).toBeFalsy();
        expect(result.current.data?.account._id).toBeFalsy();
        expect((error as Error).message).not.toEqual(failResponse.message);
      });
  });
});
