import { renderHook } from "@testing-library/react-hooks";
import { LoginResponse, useLogin } from "../useLogin";
import { QueryClient, QueryClientProvider } from "react-query";
import { apiClient } from "../../api/apiClient";
import MockAdapter from "axios-mock-adapter";
import { API_ENDPOINTS, sleep } from "../../helpers";
import { Auth } from "../../types";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/react";
import { HttpStatusCode } from "axios";

const queryClient = new QueryClient();

describe("useLogin hook", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  const responseAccount: Auth = {
    _id: "1",
    email: "jack@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const responseToken = "token";

  const successReponse: LoginResponse = {
    accessToken: responseToken,
    account: responseAccount,
  };

  it("should have initial state", () => {
    const { result } = renderHook(() => useLogin(), {
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

  it("should login successfully", async () => {
    mock.onPut(API_ENDPOINTS.login).reply(200, {
      accessToken: "token",
      account: responseAccount,
    });

    const { result } = renderHook(() => useLogin(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current.login(
      {
        email: "jack@gmail.com",
        password: "123456789",
      },
      {
        onSettled(data, error) {
          expect(data?.accessToken).toEqual(successReponse.accessToken);
          expect(data?.account.email).toEqual(successReponse.account.email);
          expect(error).toBeFalsy();
          expect(data?.account._id).toEqual(successReponse.account._id);
        },
      }
    );
  });

  it("should handle invalid credentials", async () => {
    const failResponse = { message: "fail" };
    mock
      .onPut(API_ENDPOINTS.login)
      .reply(HttpStatusCode.Unauthorized, failResponse);

    const { result } = renderHook(() => useLogin(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current
      .login({
        email: "jack@gmail.com",
        password: "123456789",
      })
      .catch((error) => {
        expect(error).toBeDefined();
        expect(result.current.data?.accessToken).toBeFalsy();
        expect(result.current.data?.account.email).toBeFalsy();
        expect(result.current.data?.account._id).toBeFalsy();
        expect((error as Error).message).toEqual(failResponse.message);
      });
  });

  it("should handle unexpected errors", async () => {
    const failResponse = { message: "Something went wrong" };

    mock.onPut(API_ENDPOINTS.login).reply(500, failResponse);

    const { result } = renderHook(() => useLogin(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current
      .login({
        email: "jack@gmail.com",
        password: "123456789",
      })
      .catch((error) => {
        expect(error).toBeDefined();
        expect(result.current.data?.accessToken).toBeFalsy();
        expect(result.current.data?.account.email).toBeFalsy();
        expect(result.current.data?.account._id).toBeFalsy();
        expect((error as Error).message).toEqual(failResponse.message);
      });
  });

  it("should validate input before call api", async () => {
    const failResponse = { message: "Something went wrong" };

    mock.onPut(API_ENDPOINTS.login).reply(500, failResponse);

    const { result } = renderHook(() => useLogin(), {
      // @ts-ignore
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await result.current
      .login({
        email: "jackmail.com",
        password: "123456789",
      } as any)
      .catch((error) => {
        expect(error).toBeDefined();
        expect(result.current.data?.accessToken).toBeFalsy();
        expect(result.current.data?.account.email).toBeFalsy();
        expect(result.current.data?.account._id).toBeFalsy();
        expect((error as Error).message).not.toEqual(failResponse.message);
      });

    await result.current
      .login({
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
