import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Dashboard } from "../Dashboard";

import * as loginHook from "../../hooks/useLogin";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { SendMessageForm } from "../Dashboard/SendMessageForm";

const queryClient = new QueryClient();

describe("DashboardScreen", () => {
  it("renders the dashboard view", async () => {
    // Render the component
    const { container } = render(<Dashboard />, {
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
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type messages here...")).toBeInTheDocument();
  });
});
