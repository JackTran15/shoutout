import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import * as deleteMessageHook from "../../hooks/useDeleteMessage";
import * as messagesHook from "../../hooks/useMessages";
import { MessageDTO } from "../../types";
import { SentMessage } from "../SentMessage";


describe("SentMessage", () => {
  it("should render the sent message correctly", () => {
    const messageMock: MessageDTO = {
      _id: "616161616161616161616161",
      content: "This is a test message",
      author: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockOnDelete = vi.fn();
    const mockRefetch=vi.fn()

    vi.spyOn(deleteMessageHook, "useDeleteMessage").mockImplementation(() => {
        return {
            deleteMessage: mockOnDelete,
            isLoading: false,
            data: null as any,
            error: null as any,
        };
      });
  

      vi.spyOn(messagesHook, "useMessages").mockImplementation(() => {
        return {
            refetch:mockRefetch,
            isLoading: false,
            data: null as any,
            error: null as any,
            
        } as any
      });
  
    const { container } = render(
      <SentMessage data={messageMock} onDelete={mockOnDelete} />,
      {
        wrapper: (props) => {
          return <BrowserRouter>{props.children}</BrowserRouter>;
        },
      }
    );

    expect(screen.getByText(messageMock.content)).toBeInTheDocument();

    const deleteMessageBtn=container.querySelector('div.delete-message-btn')
    expect(deleteMessageBtn).toBeInTheDocument()

    fireEvent.click(deleteMessageBtn!)
    expect(mockOnDelete).toHaveBeenCalled()
  });
});
