import { act, fireEvent, render, screen } from "@testing-library/react";
import { RegisterScreen } from "../Register";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import * as registerHook from "../../hooks/useRegister";

const queryClient = new QueryClient();

describe("RegisterScreen", () => {
  it("renders the register form and handles successful register", async () => {
    const mockRegister = vi.fn();

    vi.spyOn(registerHook, "useRegister").mockImplementation(() => {
      return {
        register: mockRegister,
        isLoading: false,
        data: null as any,
        error: null as any,
      };
    });

    // Render the component
    const { container } = render(<RegisterScreen />, {
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
    expect(screen.getByText("REGISTER NEW ACCOUNT")).toBeInTheDocument();
    expect(screen.getByText("Email address")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()

    // check exist achorLink redirect login
    const anchoLogin=screen.getByText('Login')
    expect(anchoLogin).toBeInTheDocument()
    expect(anchoLogin).toHaveAttribute('href', '/login')

    const buttonSubmit = container.querySelector('button[type="submit"]');
    expect(buttonSubmit?.innerHTML).toEqual("Register");

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

    const confirmPassword = container.querySelector(
      'input[name="confirmPassword"]'
    );
    expect(confirmPassword).toBeInTheDocument();

    if (confirmPassword)
      fireEvent.change(confirmPassword, {
        target: { value: "password123" },
      });

    // // Simulate a form submission
    if (buttonSubmit) fireEvent.click(buttonSubmit);

    // // Wait for any asynchronous actions to complete
    await act(async () => {});

    // // Verify that the register function was called with the correct data
    expect(mockRegister).toBeCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      },
      {
        onSuccess: expect.any(Function)
      }
    );
    
    await act(async () => {});
  });

  it("should render loading the register form when register succeed", async () => {
    const mockRegister = vi.fn();

    vi.spyOn(registerHook, "useRegister").mockImplementation(() => {
      return {
        register: mockRegister,
        isLoading: true,
        data: true as any,
        error: null as any,
      };
    });

    // Render the component
    const { container } = render(<RegisterScreen />, {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    await act(() => {});
    const buttonSubmit = container.querySelector('button.loading-btn');
    expect(buttonSubmit?.innerHTML).not.toBe("Register")
    expect(buttonSubmit?.getAttribute('disabled')).toBeFalsy()
  });

  it("handles loading state", async () => {
    // Mock the return values of useLogin with isLoading true
    const mockRegister = vi.fn();

    vi.spyOn(registerHook, "useRegister").mockImplementation(() => {
      return {
        register: mockRegister,
        isLoading: true,
        data: null as any,
        error: null as any,
      };
    });

    // Render the component
    render(<RegisterScreen />, {
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
    const mockRegister = vi.fn();
    const errorMessage = "Account already exists";
    vi.spyOn(registerHook, "useRegister").mockImplementation(() => {
      return {
        register: mockRegister,
        isLoading: true,
        data: null as any,
        error: { message: errorMessage } as any,
      };
    });

    // Render the component
    render(<RegisterScreen />, {
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
