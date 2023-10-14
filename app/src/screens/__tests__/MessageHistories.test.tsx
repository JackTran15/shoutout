import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils"; // Added act to handle useEffect
import { MessageHistories } from "../Dashboard/MessageHistories"; // Import your component
import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "../../helpers";
import * as useMessagesHook from "../../hooks/useMessages";
import { MessageDTO } from "../../types";

describe("MessageHistories Component", () => {
  it("renders error message when it happened", () => {
    vi.spyOn(useMessagesHook, "useMessages").mockImplementation(() => {
      return {
        data: null,
        isLoading: false,
        error: "Cannot load messages",
      } as any;
    });

    render(<MessageHistories messagesCreated={false} />, {
      // @ts-ignore
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    // Assert that the message is rendered
    expect(screen.getByText("Cannot load messages")).toBeInTheDocument();
  });

  it("renders messages when data is available", async () => {
    const data: MessageDTO[] = [
      {
        _id: "1234569",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: "user_id",
        content: "Lorem ipsum",
      },
      {
        _id: "12345690",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: "user_id",
        content: "Lorem ipsum 2",
      },
    ];

    vi.spyOn(useMessagesHook, "useMessages").mockImplementation(() => {
      return {
        data: { pages: [{ data }] },
        isLoading: false,
        error: null,
      } as any;
    });

    render(<MessageHistories messagesCreated={false} />, {
      // @ts-ignore
      wrapper: ({ children }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </BrowserRouter>
      ),
    });

    await act(async () => {});
    // Assert that the message is rendered
    expect(screen.getByText(data[0].content)).toBeInTheDocument();
    expect(screen.getByText(data[1].content)).toBeInTheDocument();
  });
});
