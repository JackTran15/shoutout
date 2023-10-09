import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { LoginScreen } from "../Login";

import * as loginHook from "../../hooks/useLogin";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

describe("LoginScreen", () => {
  it("renders the login form and handles successful login", async () => {
    const mockLogin = vi.fn();

    vi.spyOn(loginHook, "useLogin").mockImplementation(() => {
      return {
        login: mockLogin,
        isLoading: false,
        data: null as any,
        error: null as any,
      };
    });

    // Render the component
    const { container } = render(<LoginScreen />, {
      // @ts-ignore
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    // Check if the form elements are present
    expect(screen.getByText("LOGIN TO AN ACCOUNT")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();

    const buttonSubmit = container.querySelector('button[type="submit"]');
    expect(buttonSubmit?.innerHTML).toEqual("Login");

    // // Simulate a user filling out the form
    const emailInput = container.querySelector('input[name="email"]');
    expect(emailInput).toBeInTheDocument();

    if (emailInput)
      fireEvent.change(emailInput, {
        target: { value: "test@example.com" },
      });

    const passwordInput = container.querySelector('input[name="password"]');
    expect(passwordInput).toBeInTheDocument();

    if (passwordInput)
      fireEvent.change(passwordInput, {
        target: { value: "password123" },
      });

    // // Simulate a form submission
    if (buttonSubmit) fireEvent.click(buttonSubmit);

    // // Wait for any asynchronous actions to complete
    await act(async () => {});

    // // Verify that the login function was called with the correct data
    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

    await act(async () => {});
  });

  it("should not render the login form when login succeed", async () => {
    const mockLogin = vi.fn();

    vi.spyOn(loginHook, "useLogin").mockImplementation(() => {
      return {
        login: mockLogin,
        isLoading: false,
        data: true as any,
        error: null as any,
      };
    });

    // Render the component
    const { container } = render(<LoginScreen />, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    await act(() => {});
    const buttonSubmit = container.querySelector('button[type="submit"]');
    expect(buttonSubmit?.innerHTML).toBeFalsy();

    const emailInput = container.querySelector('input[name="email"]');
    expect(emailInput).not.toBeInTheDocument();
  });

  it("handles loading state", async () => {
    // Mock the return values of useLogin with isLoading true
    const mockLogin = vi.fn();

    vi.spyOn(loginHook, "useLogin").mockImplementation(() => {
      return {
        login: mockLogin,
        isLoading: true,
        data: null as any,
        error: null as any,
      };
    });

    // Render the component
    render(<LoginScreen />, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    // Verify that the loading spinner is displayed
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles error state", async () => {
    const mockLogin = vi.fn();
    const errorMessage = "Invalid credentials";
    vi.spyOn(loginHook, "useLogin").mockImplementation(() => {
      return {
        login: mockLogin,
        isLoading: true,
        data: null as any,
        error: { message: errorMessage } as any,
      };
    });

    // Render the component
    render(<LoginScreen />, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    // Verify that an error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
